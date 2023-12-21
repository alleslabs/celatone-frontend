import axios from "axios";
import { z } from "zod";

import type { Block, Validator } from "lib/types";
import { zValidatorAddr, zUtcDate } from "lib/types";
import { parseTxHash } from "lib/utils";

const zBlocksResponseItem = z
  .object({
    hash: z.string().transform(parseTxHash),
    height: z.number().nonnegative(),
    timestamp: zUtcDate,
    transaction_count: z.number().nonnegative(),
    validator: z.nullable(
      z
        .object({
          operator_address: zValidatorAddr.nullable(),
          moniker: z.string(),
          identity: z.string(),
        })
        .transform<Validator>((val) => ({
          // nullable operator address for ICS chain
          validatorAddress: val.operator_address ?? zValidatorAddr.parse(""),
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

const zBlocksResponse = z.object({
  items: z.array(zBlocksResponseItem),
  total: z.number().nonnegative(),
});
export type BlocksResponse = z.infer<typeof zBlocksResponse>;

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
    .then((res) => zBlocksResponse.parse(res.data));
