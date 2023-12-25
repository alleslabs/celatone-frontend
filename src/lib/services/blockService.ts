import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import { getBlockDetailsByHeightQueryDocument } from "lib/query";
import type { BlockDetails, Nullable, ValidatorAddr } from "lib/types";
import { isBlock, parseDate, parseTxHash } from "lib/utils";

import { getBlocks, type BlocksResponse } from "./block";

export const useBlocks = (
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<BlocksResponse, Error>,
    "onSuccess" | "onError"
  > = {}
): UseQueryResult<BlocksResponse> => {
  const endpoint = useBaseApiRoute("blocks");
  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCKS, endpoint, limit, offset],
    async () => getBlocks(endpoint, limit, offset),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useBlockInfoQuery = (
  height: string
): UseQueryResult<Nullable<BlockDetails>> => {
  const { currentChainId } = useCelatoneApp();
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getBlockDetailsByHeightQueryDocument, {
          height: Number(height),
        })
        .then<Nullable<BlockDetails>>(({ blocks_by_pk }) =>
          blocks_by_pk
            ? {
                network: currentChainId,
                hash: parseTxHash(blocks_by_pk.hash),
                height: blocks_by_pk.height,
                timestamp: parseDate(blocks_by_pk.timestamp),
                gasUsed:
                  blocks_by_pk.transactions_aggregate.aggregate?.sum?.gas_used,
                gasLimit:
                  blocks_by_pk.transactions_aggregate.aggregate?.sum?.gas_limit,
                proposer: blocks_by_pk.validator
                  ? {
                      moniker: blocks_by_pk.validator.moniker,
                      validatorAddress: blocks_by_pk.validator
                        .operator_address as ValidatorAddr,
                      identity: blocks_by_pk.validator.identity,
                    }
                  : null,
              }
            : null
        ),
    [indexerGraphClient, currentChainId, height]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCK_INFO, indexerGraphClient, height],
    queryFn,
    {
      enabled: isBlock(height),
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};
