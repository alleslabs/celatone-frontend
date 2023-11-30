import axios from "axios";
import { z } from "zod";

import type { Block, Validator } from "lib/types";
import { ValidatorAddrSchema } from "lib/types";
import { parseTxHash } from "lib/utils";

const BlocksResponseItemSchema = z
  .object({
    hash: z.string().transform(parseTxHash),
    height: z.number().nonnegative(),
    timestamp: z.coerce.date(),
    transaction_count: z.number().nonnegative(),
    validator: z.nullable(
      z
        .object({
          operator_address: ValidatorAddrSchema,
          moniker: z.string().optional(),
          identity: z.string().optional(),
        })
        .transform<Validator>((val) => ({
          validatorAddress: val.operator_address,
          moniker: val.moniker,
          identity: val.identity,
        }))
    ),
  })
  .transform<Block>((val) => ({
    hash: val.hash,
    height: val.height,
    timestamp: val.timestamp,
    txCount: val.transaction_count,
    proposer: val.validator,
  }));

const BlocksResponseSchema = z.object({
  items: z.array(BlocksResponseItemSchema),
  total: z.number(),
});
export type BlocksResponse = z.infer<typeof BlocksResponseSchema>;

export const getBlocks = async (
  endpoint: string,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
      },
    })
    .then((res) => BlocksResponseSchema.parse(res.data));
