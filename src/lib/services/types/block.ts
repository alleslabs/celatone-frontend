import { z } from "zod";

import type {
  BechAddr,
  Block,
  BlockData,
  Message,
  Pagination,
  Transaction,
  Validator,
} from "lib/types";
import {
  ActionMsgType,
  MsgFurtherAction,
  zPagination,
  zUtcDate,
  zValidatorAddr,
} from "lib/types";
import { createTxHash, parseTxHash, snakeToCamel } from "lib/utils";

import { zTx } from "./tx";

const zNullableValidator = z.nullable(
  z
    .object({
      validator_address: zValidatorAddr.nullable(),
      moniker: z.string(),
      identity: z.string(),
    })
    .transform<Validator>((val) => ({
      // nullable operator address for ICS chain
      validatorAddress: val.validator_address ?? zValidatorAddr.parse(""),
      moniker: val.moniker,
      identity: val.identity,
    }))
);

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
    timestamp: val.timestamp,
    txCount: val.transaction_count,
    proposer: val.validator,
  }));

export const zBlocksResponse = z.object({
  items: z.array(zBlocksResponseItem),
  total: z.number().nonnegative(),
});
export type BlocksResponse = z.infer<typeof zBlocksResponse>;

export const zBlockDataResponse = z
  .object({
    hash: z.string().transform(parseTxHash),
    height: z.number().nonnegative(),
    timestamp: zUtcDate,
    validator: zNullableValidator,
    gas_used: z.number().nullable(),
    gas_limit: z.number().nullable(),
  })
  .transform<BlockData>((val) => ({
    hash: val.hash,
    height: val.height,
    timestamp: val.timestamp,
    proposer: val.validator,
    gasUsed: val.gas_used,
    gasLimit: val.gas_limit,
  }));

export const zBlockLcd = z.object({
  block: z.object({
    header: z.object({
      chain_id: z.string(),
      height: z.coerce.number(),
      time: zUtcDate,
      proposer_address: z.string(),
    }),
    data: z.object({
      txs: z.array(z.string()),
    }),
  }),
  block_id: z.object({
    hash: z.string(),
  }),
});

export const zBlockDataResponseLcd = zBlockLcd
  .extend({
    txs: z.array(zTx),
    pagination: zPagination,
  })
  .transform(snakeToCamel)
  .transform<{
    block: BlockData;
    transactions: Transaction[];
    pagination: Pagination;
    rawProposerAddress: string;
  }>((val) => {
    // 1. Create Tx Hashes
    const txHashes = val.block.data.txs.map(createTxHash);

    // 2. Parse Tx to Transaction
    const transactions = val.txs.map((tx, idx) => {
      const txBody = tx.body;
      const message = txBody.messages[0];
      const sender = (message?.sender ||
        message?.signer ||
        message?.fromAddress ||
        "") as BechAddr;

      const messages = txBody.messages.map<Message>((msg) => ({
        log: undefined,
        type: msg["@type"],
      }));

      return {
        hash: txHashes[idx],
        messages,
        sender,
        isSigner: true,
        height: val.block.header.height,
        created: val.block.header.time,
        success: false, // NOTE: Hidden in Lite Tier
        // TODO: implement below later
        actionMsgType: ActionMsgType.OTHER_ACTION_MSG,
        furtherAction: MsgFurtherAction.NONE,
        isIbc: false,
        isOpinit: false,
        isInstantiate: false,
      };
    });

    // 3. Create Block Data
    const block: BlockData = {
      hash: Buffer.from(val.blockId.hash, "base64").toString("hex"),
      height: val.block.header.height,
      timestamp: val.block.header.time,
      proposer: null, // NOTE: Will be filled in the next step
      gasLimit: undefined,
      gasUsed: undefined,
    };

    return {
      block,
      transactions,
      pagination: val.pagination,
      rawProposerAddress: val.block.header.proposerAddress,
    };
  });

export type BlockDataResponseLcd = z.infer<typeof zBlockDataResponseLcd>;
