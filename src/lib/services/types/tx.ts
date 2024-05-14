import { z } from "zod";

import type { Transaction } from "lib/types";
import {
  MsgFurtherAction,
  zBechAddr,
  zCoin,
  zMessageResponse,
  zPagination,
  zUtcDate,
} from "lib/types";
import {
  getActionMsgType,
  getMsgFurtherAction,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";

// ----------------------------------------
// --------------AuthInfo------------------
// ----------------------------------------
const zModeInfoMulti = z.object({
  bitarray: z.object({
    extraBitsStored: z.number(),
    elems: z.array(z.number()),
  }),
  modeInfos: z.array(z.object({})),
});

const zModeInfoSingle = z.object({
  mode: z.string(),
});

const zModeInfo = z.object({
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
    messages: z.array(zMessageResponse).nullable(),
    memo: z.string(),
    timeout_height: z.string(),
    extension_options: z.any().array(),
    non_critical_extension_options: z.any().array(),
  })
  .transform(snakeToCamel);
export type TxBody = z.infer<typeof zTxBody>;

const zTx = z
  .object({
    "@type": z.string(),
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
  .transform(snakeToCamel);
export type Log = z.infer<typeof zLog>;

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
    timestamp: zUtcDate.optional(),
    events: z.array(zEvent),
  })
  .transform(snakeToCamel);
export type TxResponse = z.infer<typeof zTxResponse>;

export interface TxData extends TxResponse {
  chainId: string;
  isTxFailed: boolean;
}

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

export const zTxsByAddressResponseLcd = z.object({
  tx_responses: z.array(zTxResponse),
  pagination: zPagination.nullable(),
  total: z.string(),
});
export type TxsByAddressResponse = z.infer<typeof zTxsByAddressResponseLcd>;
