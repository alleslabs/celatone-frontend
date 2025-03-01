import type { Log } from "@cosmjs/stargate/build/logs";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { z } from "zod";

import type {
  Message,
  Transaction,
  TransactionWithSignerPubkey,
} from "lib/types";
import {
  ActionMsgType,
  MsgFurtherAction,
  zBechAddr,
  zCoin,
  zGas,
  zHex,
  zHexAddr20,
  zHexBig,
  zHexBool,
  zMessageResponse,
  zPagination,
  zPubkeyMulti,
  zPubkeySingle,
  zUtcDate,
} from "lib/types";
import {
  extractTxLogs,
  getActionMsgType,
  getMsgFurtherAction,
  getTxBadges,
  parseTxHash,
  snakeToCamel,
  toChecksumAddress,
} from "lib/utils";

import { zAny } from "./protobuf";

// ----------------------------------------
// --------------AuthInfo------------------
// ----------------------------------------

const zModeInfoSingle = z.object({
  single: z.object({
    mode: z.union([
      z.custom<SignMode>((val) => SignMode[val as keyof typeof SignMode]),
      z.literal(9999), // minievm sign mode,
    ]),
  }),
});

const zModeInfoMulti = z.object({
  multi: z.object({
    bitarray: z.object({
      extra_bits_stored: z.number(),
      elems: z.string(), // base64 encoded of Uint8Array
    }),
    // assuming one nesting level for now as multisig pubkey is also one level
    mode_infos: z.array(zModeInfoSingle),
  }),
});

const zSignerInfoBase = z.object({
  sequence: z.string(),
});

const zSignerInfoSingle = zSignerInfoBase.extend({
  mode_info: zModeInfoSingle,
  public_key: zPubkeySingle,
});

const zSignerInfoMulti = zSignerInfoBase.extend({
  mode_info: zModeInfoMulti,
  public_key: zPubkeyMulti,
});

const zSignerInfo = z
  .union([zSignerInfoSingle, zSignerInfoMulti])
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
  .transform((val) => ({
    ...snakeToCamel(val),
    messages: val.messages,
  }));
export type TxBody = z.infer<typeof zTxBody>;

export const zTx = z
  .object({
    body: zTxBody,
    auth_info: zAuthInfo,
    signatures: z.array(z.string()),
  })
  .transform((val) => ({
    ...snakeToCamel(val),
    body: val.body,
  }));
export type Tx = z.infer<typeof zTx>;

const zEventAttribute = z.object({
  key: z.string(),
  value: z.union([z.string(), z.null().transform(() => "")]),
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
    tx: val.tx,
    logs: val.logs,
  }));
export type TxResponse = z.infer<typeof zTxResponse>;

export interface TxData extends TxResponse {
  chainId: string;
  isTxFailed: boolean;
}

export const zTxsResponseItemFromLcd =
  zTxResponse.transform<TransactionWithSignerPubkey>((val) => {
    const txBody = val.tx.body;

    const logs = extractTxLogs(val);

    const messages = txBody.messages.map<Message>((msg, idx) => ({
      log: logs[idx],
      type: msg["@type"],
      ...msg,
    }));

    const { isIbc, isOpinit, isEvm } = messages.reduce(
      (acc, msg, idx) => {
        const current = getTxBadges(msg.type, logs[idx]);
        return {
          isIbc: acc.isIbc || current.isIbc,
          isOpinit: acc.isOpinit || current.isOpinit,
          isEvm: acc.isEvm || current.isEvm,
        };
      },
      { isIbc: false, isOpinit: false, isEvm: false }
    );

    return {
      hash: val.txhash,
      messages,
      signerPubkey: val.tx.authInfo.signerInfos[0].publicKey,
      isSigner: true,
      height: Number(val.height),
      created: val.timestamp,
      success: val.code === 0,
      isIbc,
      isOpinit,
      isEvm,
      events: val.events,
      // TODO: implement below later
      actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
      furtherAction: MsgFurtherAction.NONE,
      isInstantiate: false,
    };
  });

export const zTxsByAddressResponseLcd = z
  .object({
    tx_responses: z.array(zTxsResponseItemFromLcd),
    total: z.coerce.number(),
  })
  .transform((val) => ({
    items: val.tx_responses,
    total: val.total,
  }));
export type TxsByAddressResponseLcd = z.infer<typeof zTxsByAddressResponseLcd>;

export const zTxsResponseSequencer = z
  .object({
    txs: z.array(zTxsResponseItemFromLcd),
    pagination: zPagination,
  })
  .transform((val) => ({
    items: val.txs,
    pagination: val.pagination,
  }));

export const zTxsByHashResponseLcd = z
  .object({
    tx_response: zTxsResponseItemFromLcd,
  })
  .transform((val) => ({
    items: [val.tx_response],
    total: 1,
  }));

export const zTxsByHashResponseSequencer = z
  .object({
    tx: zTxsResponseItemFromLcd,
  })
  .transform((val) => ({
    items: [val.tx],
    pagination: {
      total: val.tx ? 1 : 0,
      nextKey: null,
    },
  }));
export type TxsByHashResponseSequencer = z.infer<
  typeof zTxsByHashResponseSequencer
>;

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
  is_evm: z.boolean().optional(),
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
    isEvm: val.is_evm ?? false,
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
    isEvm: val.is_evm ?? false,
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

export const zBlockTxsResponseSequencer = z.object({
  txs: z.array(zTxsResponseItemFromLcd),
  pagination: zPagination,
});

const zTxByPoolIdResponse = z
  .object({
    created: zUtcDate,
    hash: z.string(),
    height: z.number().nonnegative(),
    is_ibc: z.boolean(),
    messages: z.any().array(),
    sender: zBechAddr,
    success: z.boolean(),
  })
  .transform<Transaction>((val) => ({
    ...snakeToCamel(val),
    hash: parseTxHash(val.hash),
    messages: snakeToCamel(val.messages) as Message[],
    isSigner: true,
    actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
    furtherAction: MsgFurtherAction.NONE,
    isInstantiate: false,
    isOpinit: false,
    isEvm: false,
  }));

export const zTxsByPoolIdResponse = z.object({
  items: z.array(zTxByPoolIdResponse),
});

export const zTxsByPoolIdTxsCountResponse = z.object({
  total: z.number().nullable(),
});

// ----------------------------------------
// --------------- JSON RPC ---------------
// ----------------------------------------

export const zEvmTxHashByCosmosTxHashJsonRpc = z.string().transform((val) =>
  val !== "0x0000000000000000000000000000000000000000000000000000000000000000" // if no related evm tx
    ? val
    : null
);

export const zEvmTxHashesByCosmosTxHashesJsonRpc = z.array(
  zEvmTxHashByCosmosTxHashJsonRpc
);

export const zTxJsonRpc = z
  .object({
    blockHash: z.string(),
    blockNumber: zHexBig,
    from: zHexAddr20,
    gas: zHexBig,
    gasPrice: zHexBig,
    maxFeePerGas: zHexBig,
    maxPriorityFeePerGas: zHexBig,
    hash: z.string(),
    input: z.string(),
    nonce: zHexBig,
    to: zHexAddr20.nullable(),
    transactionIndex: zHexBig,
    value: zHexBig,
    type: z.string(), // TODO: convert to enum later
    chainId: zHexBig,
    v: z.string(),
    r: z.string(),
    s: z.string(),
    yParity: z.string().optional(),
  })
  .transform(({ from, to, ...val }) => ({
    from: toChecksumAddress(from),
    to: to ? toChecksumAddress(to) : null,
    ...val,
  }));

const zTxReceiptJsonRpcLog = z.object({
  address: zHexAddr20,
  topics: z.string().array(),
  data: z.string(),
  blockNumber: zHexBig,
  transactionHash: z.string(),
  transactionIndex: zHexBig,
  blockHash: z.string(),
  logIndex: zHexBig,
  removed: z.boolean(),
});
export type TxReceiptJsonRpcLog = z.infer<typeof zTxReceiptJsonRpcLog>;

export const zTxReceiptJsonRpc = z
  .object({
    blockHash: z.string(),
    blockNumber: zHexBig,
    contractAddress: zHexAddr20.nullable(),
    cumulativeGasUsed: zHexBig,
    effectiveGasPrice: zHexBig,
    from: zHexAddr20,
    gasUsed: zHexBig,
    logs: z.array(zTxReceiptJsonRpcLog),
    logsBloom: zHex,
    status: zHexBool,
    to: zHexAddr20.nullable(),
    transactionHash: z.string(),
    transactionIndex: zHexBig,
    type: z.string(), // TODO: convert to enum later
  })
  .transform(({ from, to, contractAddress, ...val }) => ({
    from: toChecksumAddress(from),
    to: to ? toChecksumAddress(to) : null,
    contractAddress: contractAddress
      ? toChecksumAddress(contractAddress)
      : null,
    ...val,
  }));
export type TxReceiptJsonRpc = z.infer<typeof zTxReceiptJsonRpc>;

export const zTxDataJsonRpc = z
  .tuple([zTxJsonRpc, zTxReceiptJsonRpc])
  .transform(([tx, txReceipt]) => ({ tx, txReceipt }));
export type TxDataJsonRpc = z.infer<typeof zTxDataJsonRpc>;

export const zTxsDataJsonRpc = z.array(zTxDataJsonRpc);
export type TxsDataJsonRpc = z.infer<typeof zTxsDataJsonRpc>;

export type TxDataWithTimeStampJsonRpc = TxDataJsonRpc & { timestamp: Date };

export const zSimulateFeeEvm = z
  .tuple([zHexBig, zGas(zHexBig)])
  .transform(([gasPrice, simulatedGasUsed]) => ({
    gasPrice,
    simulatedGasUsed,
  }));
export type SimulatedFeeEvm = z.infer<typeof zSimulateFeeEvm>;

export const zEvmMsgCreate = z.object({
  type: z.literal("/minievm.evm.v1.MsgCreate"),
  code: z.string(),
});
