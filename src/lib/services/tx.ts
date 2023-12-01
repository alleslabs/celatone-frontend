import type { Event, logs } from "@cosmjs/stargate";
import axios from "axios";
import type { CompactBitArray } from "cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig";
import type { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import type { Any } from "cosmjs-types/google/protobuf/any";
import { z } from "zod";

import type { TypeUrl } from "lib/data";
import type { Transaction, Option, Fee } from "lib/types";
import { zAddr, MsgFurtherAction, zUtcDate } from "lib/types";
import {
  getActionMsgType,
  parseDateOpt,
  parseTxHash,
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

const zTxsResponseItem = z
  .object({
    block: z.object({
      height: z.number().nonnegative(),
      timestamp: zUtcDate,
    }),
    hash: z.string(),
    messages: z.any().array(),
    signer: zAddr,
    success: z.boolean(),
    is_ibc: z.boolean(),
    is_send: z.boolean(),
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
  })
  .transform<Transaction>((val) => ({
    hash: parseTxHash(val.hash),
    messages: snakeToCamel(val.messages),
    sender: val.signer,
    isSigner: false,
    height: val.block.height,
    created: val.block.timestamp,
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
    isInstantiate: val.is_instantiate ?? false,
  }));

const zTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number(),
});
export type TxsResponse = z.infer<typeof zTxsResponse>;

export const getTxs = async (
  endpoint: string,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
      },
    })
    .then((res) => zTxsResponse.parse(res.data));
