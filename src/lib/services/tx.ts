import type { Event, logs } from "@cosmjs/stargate";
import axios from "axios";
import type { CompactBitArray } from "cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig";
import type { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import type { Any } from "cosmjs-types/google/protobuf/any";
import { z } from "zod";

import type { TypeUrl } from "lib/data";
import type { BechAddr, Fee, Option, Transaction, TxFilters } from "lib/types";
import { MsgFurtherAction, zBechAddr, zUtcDate } from "lib/types";
import {
  camelToSnake,
  getActionMsgType,
  getMsgFurtherAction,
  parseDateOpt,
  parseTxHash,
  parseWithError,
  snakeToCamel,
} from "lib/utils";

// ----------------------------------------
// --------------AuthInfo------------------
// ----------------------------------------
interface AuthInfo {
  signer_infos: SignerInfo[];
  fee?: Fee;
}

interface SignerInfo {
  public_key?: { "@type": string; key: string };
  mode_info?: ModeInfo;
  sequence: string;
}

interface ModeInfo {
  single?: ModeInfoSingle | undefined;
  multi?: ModeInfoMulti | undefined;
}

interface ModeInfoSingle {
  mode: keyof typeof SignMode;
}

// Revisit Multisig Info
interface ModeInfoMulti {
  bitarray?: CompactBitArray;
  modeInfos: ModeInfo[];
}

// ----------------------------------------
// -----------------Tx---------------------
// ----------------------------------------
export interface MsgBody {
  "@type": TypeUrl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TxBody {
  messages: MsgBody[];
  memo: string;
  timeout_height: string;
  // Revisit extension options
  extension_options: Any[];
  non_critical_extension_options: Any[];
}

export interface Tx {
  "@type": string;
  body: TxBody;
  auth_info: AuthInfo;
  signatures: string[];
}

export interface TxResponse {
  height: string;
  txhash: string;
  codespace: string;
  code: number;
  data: string;
  raw_log: string;
  logs: logs.Log[];
  info: string;
  gas_wanted: string;
  gas_used: string;
  tx: Tx;
  timestamp: Option<Date>;
  events: Event[];
}

export const queryTxData = async (
  txsApiRoute: string,
  txHash: string
): Promise<TxResponse> => {
  const { data } = await axios.get(`${txsApiRoute}/${txHash.toUpperCase()}`);

  return {
    ...data.tx_response,
    timestamp: parseDateOpt(data.tx_response.timestamp),
  };
};

const zBaseTxsResponseItem = z.object({
  height: z.number().nonnegative(),
  created: zUtcDate,
  hash: z.string(),
  messages: z.any().array(),
  sender: zBechAddr,
  success: z.boolean(),
  is_ibc: z.boolean(),
  is_send: z.boolean(),
  // initia
  is_opinit: z.boolean().optional(),
  // wasm
  is_clear_admin: z.boolean().optional(),
  is_execute: z.boolean().optional(),
  is_instantiate: z.boolean().optional(),
  is_migrate: z.boolean().optional(),
  is_store_code: z.boolean().optional(),
  is_update_admin: z.boolean().optional(),
  // move
  is_move_execute: z.boolean().optional(),
  is_move_publish: z.boolean().optional(),
  is_move_script: z.boolean().optional(),
  is_move_upgrade: z.boolean().optional(),
});

export const zTxsResponseItem = zBaseTxsResponseItem.transform<Transaction>(
  (val) => ({
    hash: parseTxHash(val.hash),
    messages: snakeToCamel(val.messages),
    sender: val.sender,
    isSigner: false,
    height: val.height,
    created: val.created,
    success: val.success,
    actionMsgType: getActionMsgType([
      val.is_send,
      val.is_execute,
      val.is_instantiate,
      val.is_store_code,
      val.is_migrate,
      val.is_update_admin,
      val.is_clear_admin,
      // TODO: implement Move msg type
    ]),
    furtherAction: MsgFurtherAction.NONE,
    isIbc: val.is_ibc,
    isOpinit: val.is_opinit ?? false,
    isInstantiate: val.is_instantiate ?? false,
  })
);

const zTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number().nonnegative(),
});
export type TxsResponse = z.infer<typeof zTxsResponse>;

export const getTxs = async (
  endpoint: string,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponse, data));

const zAccountTxsResponseItem = zBaseTxsResponseItem
  .extend({
    is_signer: z.boolean(),
  })
  .transform<Transaction>((val) => ({
    hash: parseTxHash(val.hash),
    messages: snakeToCamel(val.messages),
    sender: val.sender,
    isSigner: val.is_signer,
    height: val.height,
    created: val.created,
    success: val.success,
    actionMsgType: getActionMsgType([
      val.is_send,
      val.is_execute,
      val.is_instantiate,
      val.is_store_code,
      val.is_migrate,
      val.is_update_admin,
      val.is_clear_admin,
      // TODO: implement Move msg type
    ]),
    furtherAction: getMsgFurtherAction(
      val.messages.length,
      {
        isSend: val.is_send,
        isIbc: val.is_ibc,
        isExecute: val.is_execute,
        isInstantiate: val.is_instantiate,
        isStoreCode: val.is_store_code,
        isMigrate: val.is_migrate,
        isUpdateAdmin: val.is_update_admin,
        isClearAdmin: val.is_clear_admin,
        isMovePublish: val.is_move_publish,
        isMoveUpgrade: val.is_move_upgrade,
        isMoveExecute: val.is_move_execute,
        isMoveScript: val.is_move_script,
      },
      val.success,
      val.is_signer
    ),
    isIbc: val.is_ibc,
    isOpinit: val.is_opinit ?? false,
    isInstantiate: val.is_instantiate ?? false,
  }));

const zAccountTxsResponse = z.object({
  items: z.array(zAccountTxsResponseItem),
});
export type AccountTxsResponse = z.infer<typeof zAccountTxsResponse>;

export const getTxsByAddress = async (
  endpoint: string,
  address: BechAddr,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) => {
  const filterParams = camelToSnake<TxFilters>(txFilters);

  return axios
    .get(`${endpoint}/${encodeURIComponent(address)}/txs`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
        ...filterParams,
        ...(isSigner !== undefined && { is_signer: isSigner }),
        ...(search !== undefined && { search }),
      },
    })
    .then(({ data }) => parseWithError(zAccountTxsResponse, data));
};

const zBlockTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number().nonnegative(),
});
export type BlockTxsResponse = z.infer<typeof zBlockTxsResponse>;

export const getTxsByBlockHeight = async (
  endpoint: string,
  height: number,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) =>
  axios
    .get(`${endpoint}/${height}/txs`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
      },
    })
    .then(({ data }) => parseWithError(zBlockTxsResponse, data));

const zTxsCountResponse = z
  .object({
    count: z.number().nullish(),
  })
  .transform((val) => val.count);

export const getTxsCountByAddress = async (
  endpoint: string,
  address: BechAddr,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  isWasm: boolean
) => {
  const filterParams = camelToSnake<TxFilters>(txFilters);

  return axios
    .get(`${endpoint}/${encodeURIComponent(address)}/txs-count`, {
      params: {
        ...filterParams,
        is_wasm: isWasm, // only for `searching` contract txs
        ...(isSigner !== undefined && { is_signer: isSigner }),
        ...(search !== undefined && { search }),
      },
    })
    .then(({ data }) => parseWithError(zTxsCountResponse, data));
};
