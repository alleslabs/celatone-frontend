import type {
  Block,
  BlockData,
  Message,
  TransactionWithSignerPubkey,
  Validator,
} from "lib/types";

import {
  ActionMsgType,
  MsgFurtherAction,
  zHexAddr20,
  zHexBig,
  zHexUtcDate,
  zPagination,
  zUtcDate,
  zValidatorAddr,
} from "lib/types";
import {
  createTxHash,
  getTxBadges,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";
import { z } from "zod";

import { zTx, zTxJsonRpc, zTxReceiptJsonRpc } from "./tx";

const zNullableValidator = z.nullable(
  z
    .object({
      identity: z.string(),
      moniker: z.string(),
      operator_address: zValidatorAddr.nullish(),
    })
    .transform<Validator>((val) => ({
      identity: val.identity,
      moniker: val.moniker,
      // nullable operator address for ICS chain
      validatorAddress: val.operator_address ?? zValidatorAddr.parse(""),
    }))
);

// ---------------- API ----------------
const zBlocksResponseItem = z
  .object({
    hash: z.string().transform(parseTxHash),
    height: z.number().nonnegative(),
    timestamp: zUtcDate,
    transaction_count: z.number().nonnegative(),
    validator: zNullableValidator,
  })
  .transform<Block>((val) => ({
    hash: val.hash,
    height: val.height,
    proposer: val.validator,
    timestamp: val.timestamp,
    txCount: val.transaction_count,
  }));

export const zBlocksResponse = z.object({
  items: z.array(zBlocksResponseItem),
  total: z.number().nonnegative(),
});
export type BlocksResponse = z.infer<typeof zBlocksResponse>;

export const zBlockDataResponse = z
  .object({
    gas_limit: z.number().nullable(),
    gas_used: z.number().nullable(),
    hash: z.string().transform(parseTxHash),
    height: z.number().nonnegative(),
    timestamp: zUtcDate,
    validator: zNullableValidator,
  })
  .transform<BlockData>((val) => ({
    gasLimit: val.gas_limit,
    gasUsed: val.gas_used,
    hash: val.hash,
    height: val.height,
    proposer: val.validator,
    timestamp: val.timestamp,
  }));

// ---------------- REST ----------------
export const zBlockRest = z.object({
  block: z.object({
    data: z.object({
      txs: z.array(z.string()),
    }),
    header: z.object({
      chain_id: z.string(),
      height: z.coerce.number(),
      proposer_address: z.string(),
      time: zUtcDate,
    }),
  }),
  block_id: z.object({
    hash: z.string(),
  }),
});

export const zBlockDataResponseRest = zBlockRest
  .extend({
    pagination: zPagination,
    txs: z.array(zTx),
  })
  .transform(snakeToCamel)
  .transform<{
    block: BlockData;
    rawProposerConsensusAddress: string;
    transactions: TransactionWithSignerPubkey[];
  }>((val) => {
    // 1. Create Tx Hashes
    const txHashes = val.block.data.txs.map(createTxHash);

    // 2. Parse Tx to Transaction
    const transactions = val.txs.map((tx, idx) => {
      const txBody = tx.body;

      const messages = txBody.messages.map<Message>((msg) => ({
        log: undefined,
        type: msg["@type"],
      }));

      const { isEvm, isIbc, isOpinit } = messages.reduce(
        (acc, msg) => {
          const current = getTxBadges(msg.type, undefined);
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
        created: val.block.header.time,
        furtherAction: MsgFurtherAction.NONE,
        hash: txHashes[idx],
        height: val.block.header.height,
        isEvm,
        isIbc,
        isInstantiate: false,
        isOpinit,
        isSigner: true,
        messages,
        signerPubkey: tx.authInfo.signerInfos[0].publicKey,
        success: false, // NOTE: Hidden in Lite Tier,
      };
    });

    // 3. Create Block Data
    const block: BlockData = {
      gasLimit: undefined,
      gasUsed: undefined,
      hash: Buffer.from(val.blockId.hash, "base64").toString("hex"),
      height: val.block.header.height,
      proposer: null, // NOTE: Will be filled in the next step
      timestamp: val.block.header.time,
    };

    return {
      block,
      rawProposerConsensusAddress: val.block.header.proposerAddress,
      transactions,
    };
  });

// ---------------- Sequencer ----------------
const zBlockSequencer = z.object({
  gas_used: z.coerce.number(),
  gas_wanted: z.coerce.number(),
  hash: z.string(),
  height: z.coerce.number(),
  proposer: zNullableValidator,
  timestamp: zUtcDate,
  tx_count: z.coerce.number(),
});

const zBlocksResponseItemSequencer = zBlockSequencer.transform<Block>(
  (val) => ({
    hash: val.hash,
    height: val.height,
    proposer: val.proposer,
    timestamp: val.timestamp,
    txCount: val.tx_count,
  })
);

export const zBlocksResponseSequencer = z.object({
  blocks: z.array(zBlocksResponseItemSequencer),
  pagination: zPagination,
});

export const zBlockTimeAverageSequencer = z
  .object({
    avg_block_time: z.number().nonnegative(),
  })
  .transform(snakeToCamel);

export const zBlockDataResponseSequencer = zBlockSequencer.transform<BlockData>(
  (val) => ({
    gasLimit: val.gas_wanted,
    gasUsed: val.gas_used,
    hash: val.hash,
    height: val.height,
    proposer: val.proposer,
    timestamp: val.timestamp,
    txCount: val.tx_count,
  })
);

// ---------------- JSON RPC ----------------
export const zBlockJsonRpc = z.object({
  baseFeePerGas: zHexBig,
  difficulty: zHexBig,
  extraData: z.string(),
  gasLimit: zHexBig,
  gasUsed: zHexBig,
  hash: z.string(),
  logsBloom: z.string(),
  miner: zHexAddr20,
  mixHash: z.string(),
  nonce: zHexBig,
  number: zHexBig,
  parentHash: z.string(),
  receiptsRoot: z.string(),
  sha3Uncles: z.string(),
  size: z.string(),
  stateRoot: z.string(),
  timestamp: zHexUtcDate,
  transactions: z.array(zTxJsonRpc),
  transactionsRoot: z.string(),
});

const zBlockReceiptsJsonRpc = z.array(zTxReceiptJsonRpc);

export const zBlockDataJsonRpc = z
  .tuple([zBlockJsonRpc, zBlockReceiptsJsonRpc])
  .transform(([block, blockReceipts]) => ({ block, blockReceipts }));
