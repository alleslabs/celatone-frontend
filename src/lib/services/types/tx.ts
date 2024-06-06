import type { Log } from "@cosmjs/stargate/build/logs";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import type {
  ModeInfo,
  ModeInfo_Multi as ModeInfoMulti,
  ModeInfo_Single as ModeInfoSingle,
} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { z } from "zod";

import type { BechAddr, Message, Transaction } from "lib/types";
import {
  ActionMsgType,
  MsgFurtherAction,
  zBechAddr,
  zCoin,
  zMessageResponse,
  zUint8Schema,
  zUtcDate,
} from "lib/types";
import {
  extractTxLogs,
  getActionMsgType,
  getMsgFurtherAction,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";

import { zAny } from "./protobuf";

// ----------------------------------------
// --------------AuthInfo------------------
// ----------------------------------------

let zModeInfo: z.ZodType<ModeInfo>;

const zModeInfoSingle: z.ZodType<ModeInfoSingle> = z.object({
  mode: z.custom<SignMode>((val) => SignMode[val as keyof typeof SignMode]),
});

const zModeInfoMulti: z.ZodType<ModeInfoMulti> = z.object({
  bitarray: z.object({
    extraBitsStored: z.number(),
    elems: zUint8Schema,
  }),
  modeInfos: z.lazy(() => z.array(zModeInfo)),
});

zModeInfo = z.object({
  single: zModeInfoSingle.optional(),
  multi: zModeInfoMulti.optional(),
});

const zSignerInfo = z
  .object({
    public_key: z.object({
      "@type": z.string(),
      key: z.string(),
    }),
    mode_info: zModeInfo.optional(),
    sequence: z.string(),
  })
  .transform(snakeToCamel);

const zAuthInfo = z
  .object({
    signer_infos: z.array(zSignerInfo),
    fee: z.object({
      amount: z.array(zCoin),
      gas_limit: z.string(),
      payer: z.string(),
      granter: z.string(),
    }),
  })
  .transform(snakeToCamel);
export type AuthInfo = z.infer<typeof zAuthInfo>;

// ----------------------------------------
// -----------------Tx---------------------
// ----------------------------------------
const zTxBody = z
  .object({
    messages: z.array(zMessageResponse),
    memo: z.string(),
    timeout_height: z.string(),
    extension_options: zAny.array(),
    non_critical_extension_options: zAny.array(),
  })
  .transform(snakeToCamel);
export type TxBody = z.infer<typeof zTxBody>;

export const zTx = z
  .object({
    body: zTxBody,
    auth_info: zAuthInfo,
    signatures: z.array(z.string()),
  })
  .transform(snakeToCamel);
export type Tx = z.infer<typeof zTx>;

const zEventAttribute = z.object({
  key: z.string(),
  value: z.string(),
  index: z.boolean().optional(),
});

const zEvent = z.object({
  type: z.string(),
  attributes: z.array(zEventAttribute),
});
export type Event = z.infer<typeof zEvent>;

const zLog = z
  .object({
    msg_index: z.number(),
    log: z.string(),
    events: z.array(zEvent),
  })
  .transform<Log>((val) => val);

const zTxResponse = z
  .object({
    height: z.string(),
    txhash: z.string(),
    codespace: z.string(),
    code: z.number(),
    data: z.string(),
    raw_log: z.string(),
    logs: z.array(zLog),
    info: z.string(),
    gas_wanted: z.string(),
    gas_used: z.string(),
    tx: zTx,
    timestamp: zUtcDate,
    events: z.array(zEvent),
  })
  .transform((val) => ({
    ...snakeToCamel(val),
    logs: val.logs,
  }));
export type TxResponse = z.infer<typeof zTxResponse>;

export interface TxData extends TxResponse {
  chainId: string;
  isTxFailed: boolean;
}

export const zTxsResponseItemFromLcd = zTxResponse.transform<Transaction>(
  (val) => {
    const txBody = val.tx.body;
    const message = txBody.messages[0];
    const sender = (message?.sender ||
      message?.signer ||
      message?.fromAddress ||
      "") as BechAddr;

    const logs = extractTxLogs(val);

    const messages = txBody.messages.map<Message>((msg, idx) => ({
      log: logs[idx],
      type: msg["@type"],
    }));

    return {
      hash: val.txhash,
      messages,
      sender,
      isSigner: true,
      height: Number(val.height),
      created: val.timestamp,
      success: val.code === 0,
      // TODO: implement below later
      actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
      furtherAction: MsgFurtherAction.NONE,
      isIbc: false,
      isOpinit: false,
      isInstantiate: false,
    };
  }
);

export const zTxsByAddressResponseLcd = z
  .object({
    tx_responses: z.array(zTxsResponseItemFromLcd),
    total: z.coerce.number(),
  })
  .transform((val) => ({
    items: val.tx_responses,
    total: val.total,
  }));

export const zTxsByHashResponseLcd = z
  .object({
    tx_response: zTxsResponseItemFromLcd,
  })
  .transform((val) => ({
    items: [val.tx_response],
    total: 1,
  }));

export const zTxByHashResponseLcd = z
  .object({
    tx_response: zTxResponse,
  })
  .transform((val) => ({
    txResponse: val.tx_response,
  }));

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

export const zTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number().nonnegative(),
});
export type TxsResponse = z.infer<typeof zTxsResponse>;

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

export const zAccountTxsResponse = z.object({
  items: z.array(zAccountTxsResponseItem),
});
export type AccountTxsResponse = z.infer<typeof zAccountTxsResponse>;

export const zBlockTxsResponse = z.object({
  items: z.array(zTxsResponseItem),
  total: z.number().nonnegative(),
});
export type BlockTxsResponse = z.infer<typeof zBlockTxsResponse>;

export const zTxsCountResponse = z
  .object({
    count: z.number().nullish(),
  })
  .transform((val) => val.count);
