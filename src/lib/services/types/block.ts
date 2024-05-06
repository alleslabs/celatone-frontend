import { z } from "zod";

import type { Block, BlockData, Validator } from "lib/types";
import { zUtcDate, zValidatorAddr } from "lib/types";
import { parseTxHash } from "lib/utils";

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
