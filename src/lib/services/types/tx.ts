import type { Log } from "@cosmjs/stargate/build/logs";
import type { DecodedTx } from "@initia/tx-decoder";
import type {
  BechAddr20,
  Message,
  SnakeToCamelCaseNested,
  Transaction,
  TransactionWithSignerPubkey,
  TransactionWithTxResponse,
} from "lib/types";

import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
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
import { z } from "zod";

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
      elems: z.string(), // base64 encoded of Uint8Array
      extra_bits_stored: z.number(),
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

const zSignerInfo = z.union([zSignerInfoSingle, zSignerInfoMulti]);

const zAuthInfo = z.object({
  fee: z.object({
    amount: z.array(zCoin),
    gas_limit: z.string(),
    granter: z.string(),
    payer: z.string(),
  }),
  signer_infos: z.array(zSignerInfo),
});
export type AuthInfo = z.infer<typeof zAuthInfo>;

// ----------------------------------------
// -----------------Tx---------------------
// ----------------------------------------
const zTxBody = z.object({
  extension_options: zAny.array(),
  memo: z.string(),
  messages: z.array(zMessageResponse),
  non_critical_extension_options: zAny.array(),
  timeout_height: z.string(),
});
export type TxBody = z.infer<typeof zTxBody>;

export const zTx = z.object({
  auth_info: zAuthInfo,
  body: zTxBody,
  signatures: z.array(z.string()),
});
export type Tx = z.infer<typeof zTx>;

const zEventAttribute = z.object({
  index: z.boolean().optional(),
  key: z.string(),
  value: z.union([z.string(), z.null().transform(() => "")]),
});

const zEvent = z.object({
  attributes: z.array(zEventAttribute),
  type: z.string(),
});
export type Event = z.infer<typeof zEvent>;

const zLog = z
  .object({
    events: z.array(zEvent),
    log: z.string(),
    msg_index: z.number(),
  })
  .transform<Log>((val) => val);

const zRawTxResponse = z.preprocess(
  (val) => {
    if (
      typeof val === "object" &&
      val !== null &&
      "tx" in val &&
      val.tx === null
    ) {
      // NOTE: this is a dummy data when tx is too large
      return {
        ...val,
        timestamp: "2025-05-08T10:45:54Z",
        tx: {
          auth_info: {
            fee: {
              amount: [
                {
                  amount: "1111",
                  denom: "uinit",
                },
              ],
              gas_limit: "11111",
              granter: "",
              payer: "",
            },
            signer_infos: [
              {
                mode_info: {
                  single: {
                    mode: "SIGN_MODE_LEGACY_AMINO_JSON",
                  },
                },
                public_key: {
                  "@type": "/initia.crypto.v1beta1.ethsecp256k1.PubKey",
                  key: "Axdt0OtFq4TF/TA4EnlF4J0Lv6E+9jFccR2/ULQVXP2a",
                },
                sequence: "1",
              },
            ],
            tip: null,
          },
          body: {
            extension_options: [],
            memo: "",
            messages: [
              {
                "@type": "/cosmos.bank.v1beta1.MsgSend",
                amount: [
                  {
                    amount: "10000",
                    denom: "uinit",
                  },
                ],
                from_address: "init1randomaddress1234567890abcdefg",
                to_address: "init1randomaddress1234567890abcdefg",
              },
            ],
            non_critical_extension_options: [],
            timeout_height: "0",
          },
          signatures: [
            "zCUd/XYWvwU+vbZLi6CXWIyrZhUXCK3brhjRO7NDyQh8/WaJBgSihFTX4wJilDLuYBGfnQjPFGydZSeJPyGY3w==",
          ],
        },
      };
    }

    return val;
  },
  z.object({
    code: z.number(),
    codespace: z.string(),
    data: z.string(),
    events: z.array(zEvent),
    gas_used: z.string(),
    gas_wanted: z.string(),
    height: z.string(),
    info: z.string(),
    logs: z.array(zLog),
    raw_log: z.string(),
    timestamp: z.string(),
    tx: zTx,
    txhash: z.string(),
  })
);
export type RawTxResponse = z.infer<typeof zRawTxResponse>;

const zTxResponse = zRawTxResponse.transform((val) => ({
  ...snakeToCamel(val),
  logs: val.logs,
  timestamp: zUtcDate.parse(val.timestamp),
}));
export type TxResponse = Omit<
  SnakeToCamelCaseNested<z.infer<typeof zRawTxResponse>>,
  "logs" | "timestamp"
> & {
  logs: Log[];
  timestamp: Date;
};

export interface TxData extends TxResponse {
  chainId: string;
  decodedTx: DecodedTx;
  isTxFailed: boolean;
  signer: BechAddr20;
}

export const zTxsResponseItemFromRest = z.preprocess(
  (args: unknown) => {
    const val = args as TxResponse;
    return {
      item: val,
      rawTxResponse: val,
      txResponse: val,
    };
  },
  z.object({
    item: zTxResponse.transform<TransactionWithSignerPubkey>((val) => {
      const txBody = val.tx.body;

      const logs = extractTxLogs(val);

      const messages = txBody.messages.map<Message>((msg, idx) => ({
        log: logs[idx],
        type: msg["@type"] ?? msg["type"],
        ...msg,
      }));

      const { isEvm, isIbc, isOpinit } = messages.reduce(
        (acc, msg, idx) => {
          const current = getTxBadges(msg.type, logs[idx]);
          return {
            isEvm: acc.isEvm || current.isEvm,
            isIbc: acc.isIbc || current.isIbc,
            isOpinit: acc.isOpinit || current.isOpinit,
          };
        },
        { isEvm: false, isIbc: false, isOpinit: false }
      );

      return {
        // TODO: implement below later
        actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
        created: val.timestamp,
        events: val.events,
        furtherAction: MsgFurtherAction.NONE,
        hash: val.txhash,
        height: Number(val.height),
        isEvm,
        isIbc,
        isInstantiate: false,
        isOpinit,
        isSigner: true,
        messages,
        signerPubkey: val.tx.authInfo.signerInfos[0].publicKey,
        success: val.code === 0,
      };
    }),
    rawTxResponse: zRawTxResponse.optional(),
    txResponse: zTxResponse.optional(),
  })
);
export type TxsResponseItemFromRest = z.infer<typeof zTxsResponseItemFromRest>;

export const zTxsByAddressResponseRest = z
  .object({
    total: z.coerce.number(),
    tx_responses: z.array(zTxsResponseItemFromRest),
  })
  .transform((val) => ({
    items: val.tx_responses,
    total: val.total,
  }));
export type TxsByAddressResponseRest = z.infer<
  typeof zTxsByAddressResponseRest
>;

export const zTxsResponseSequencer = z
  .object({
    pagination: zPagination,
    txs: z.array(zTxsResponseItemFromRest),
  })
  .transform((val) => ({
    items: val.txs,
    pagination: val.pagination,
  }));

export const zTxsByHashResponseRest = z
  .object({
    tx_response: zTxsResponseItemFromRest,
  })
  .transform((val) => ({
    items: [val.tx_response],
    total: 1,
  }));

export const zTxsByHashResponseSequencer = z
  .object({
    tx: zTxsResponseItemFromRest,
  })
  .transform((val) => ({
    items: [val.tx],
    pagination: {
      nextKey: null,
      total: val.tx ? 1 : 0,
    },
  }));
export type TxsByHashResponseSequencer = z.infer<
  typeof zTxsByHashResponseSequencer
>;

export const zTxByHashResponseRest = z.preprocess(
  (arg: unknown) => {
    const val = arg as Record<string, unknown>;
    return {
      raw_tx_response: val.tx_response,
      tx_response: val.tx_response,
    };
  },
  z
    .object({
      raw_tx_response: z.any(),
      tx_response: zTxResponse.transform(snakeToCamel),
    })
    .transform((val) => ({
      rawTxResponse: val.raw_tx_response,
      txResponse: val.tx_response,
    }))
);

const zBaseTxsResponseItem = z.preprocess(
  (arg: unknown) => {
    const val = arg as Record<string, unknown>;
    return {
      ...val,
      raw_tx_response: val?.tx_response,
    };
  },
  z.object({
    created: zUtcDate,
    hash: z.string(),
    height: z.number().nonnegative(),
    // wasm
    is_clear_admin: z.boolean().optional(),
    is_evm: z.boolean().optional(),
    is_execute: z.boolean().optional(),
    is_ibc: z.boolean(),
    is_instantiate: z.boolean().optional(),
    is_migrate: z.boolean().optional(),
    // move
    is_move_execute: z.boolean().optional(),
    is_move_publish: z.boolean().optional(),
    is_move_script: z.boolean().optional(),
    // initia
    is_opinit: z.boolean().optional(),
    is_send: z.boolean(),
    is_store_code: z.boolean().optional(),
    is_update_admin: z.boolean().optional(),
    messages: z.any().array(),
    raw_tx_response: zRawTxResponse.optional(),
    sender: zBechAddr,
    success: z.boolean(),
    tx_response: zTxResponse.optional(),
  })
);

export const zTxsResponseWithTxResponseItem =
  zBaseTxsResponseItem.transform<TransactionWithTxResponse>((val) => ({
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
    created: val.created,
    furtherAction: MsgFurtherAction.NONE,
    hash: parseTxHash(val.hash),
    height: val.height,
    isEvm: val.is_evm ?? false,
    isIbc: val.is_ibc,
    isInstantiate: val.is_instantiate ?? false,
    isOpinit: val.is_opinit ?? false,
    isSigner: false,
    messages: snakeToCamel(val.messages).map((msg) => ({
      ...msg,
      type: msg["@type"] ?? msg["type"],
    })),
    rawTxResponse: val.raw_tx_response,
    sender: val.sender,
    success: val.success,
    txResponse: val.tx_response,
  }));

export const zTxsResponseWithTxResponse = z.object({
  items: z.array(zTxsResponseWithTxResponseItem),
  total: z.number().nonnegative(),
});
export type TxsResponseWithTxResponse = z.infer<
  typeof zTxsResponseWithTxResponse
>;

const zAccountTxsResponseItem = z.preprocess(
  (arg: unknown) => {
    const val = arg as Record<string, unknown>;
    return {
      ...val,
      raw_tx_response: val?.tx_response,
    };
  },
  zBaseTxsResponseItem
    .innerType()
    .extend({
      is_signer: z.boolean(),
    })
    .transform<TransactionWithTxResponse>((val) => ({
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
      created: val.created,
      furtherAction: getMsgFurtherAction(
        val.messages.length,
        {
          isClearAdmin: val.is_clear_admin,
          isExecute: val.is_execute,
          isIbc: val.is_ibc,
          isInstantiate: val.is_instantiate,
          isMigrate: val.is_migrate,
          isMoveExecute: val.is_move_execute,
          isMovePublish: val.is_move_publish,
          isMoveScript: val.is_move_script,
          isSend: val.is_send,
          isStoreCode: val.is_store_code,
          isUpdateAdmin: val.is_update_admin,
        },
        val.success,
        val.is_signer
      ),
      hash: parseTxHash(val.hash),
      height: val.height,
      isEvm: val.is_evm ?? false,
      isIbc: val.is_ibc,
      isInstantiate: val.is_instantiate ?? false,
      isOpinit: val.is_opinit ?? false,
      isSigner: val.is_signer,
      messages: snakeToCamel(val.messages).map((msg) => ({
        ...msg,
        type: msg["@type"] ?? msg["type"],
      })),
      rawTxResponse: val.raw_tx_response,
      sender: val.sender,
      success: val.success,
      txResponse: val.tx_response,
    }))
);

export const zAccountTxsResponse = z.object({
  items: z.array(zAccountTxsResponseItem),
  total: z.number().nonnegative(),
});
export type AccountTxsResponse = z.infer<typeof zAccountTxsResponse>;

export const zBlockTxsResponse = z.object({
  items: z.array(zTxsResponseWithTxResponseItem),
  total: z.number().nonnegative(),
});
export type BlockTxsResponse = z.infer<typeof zBlockTxsResponse>;

export const zTxsCountResponse = z
  .object({
    count: z.number().nullish(),
  })
  .transform((val) => val.count);

export const zBlockTxsResponseSequencer = z.object({
  pagination: zPagination,
  txs: z.array(zTxsResponseItemFromRest),
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
    actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
    furtherAction: MsgFurtherAction.NONE,
    hash: parseTxHash(val.hash),
    isEvm: false,
    isInstantiate: false,
    isOpinit: false,
    isSigner: true,
    messages: snakeToCamel(val.messages) as Message[],
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
  val !== "0x0000000000000000000000000000000000000000000000000000000000000000" // if no related EVM tx
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
    chainId: zHexBig,
    from: zHexAddr20,
    gas: zHexBig,
    gasPrice: zHexBig,
    hash: z.string(),
    input: z.string(),
    maxFeePerGas: zHexBig,
    maxPriorityFeePerGas: zHexBig,
    nonce: zHexBig,
    r: z.string(),
    s: z.string(),
    to: zHexAddr20.nullable(),
    transactionIndex: zHexBig,
    type: z.string(), // TODO: convert to enum later
    v: z.string(),
    value: zHexBig,
    yParity: z.string().optional(),
  })
  .transform(({ from, to, ...val }) => ({
    from: toChecksumAddress(from),
    to: to ? toChecksumAddress(to) : null,
    ...val,
  }));

const zTxReceiptJsonRpcLog = z.object({
  address: zHexAddr20,
  blockHash: z.string(),
  blockNumber: zHexBig,
  data: z.string(),
  logIndex: zHexBig,
  removed: z.boolean(),
  topics: z.string().array(),
  transactionHash: z.string(),
  transactionIndex: zHexBig,
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
  .transform(({ contractAddress, from, to, ...val }) => ({
    contractAddress: contractAddress
      ? toChecksumAddress(contractAddress)
      : null,
    from: toChecksumAddress(from),
    to: to ? toChecksumAddress(to) : null,
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
  code: z.string(),
  type: z.literal("/minievm.evm.v1.MsgCreate"),
});
