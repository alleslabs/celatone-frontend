import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp, useChainId } from "lib/app-provider";
import {
  getBlockCountQueryDocument,
  getBlockDetailsByHeightQueryDocument,
  getBlockListQueryDocument,
} from "lib/query";
import type { BlockDetails, BlockInfo } from "lib/types";
import { parseDate, parseTxHash } from "lib/utils";

export const useBlocklistQuery = (
  limit: number,
  offset: number
): UseQueryResult<BlockInfo[]> => {
  const chainId = useChainId();
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getBlockListQueryDocument, { limit, offset })
      .then(({ blocks }) =>
        blocks.map<BlockInfo>(
          ({ hash, height, timestamp, transactions_aggregate }) => ({
            network: chainId,
            hash: parseTxHash(hash),
            height,
            timestamp: parseDate(timestamp),
            txCount: transactions_aggregate.aggregate?.count ?? 0,
          })
        )
      );
  }, [indexerGraphClient, chainId, limit, offset]);

  return useQuery(["blocks", indexerGraphClient, limit, offset], queryFn);
};

export const useBlockCountQuery = (): UseQueryResult<number> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getBlockCountQueryDocument)
      .then(({ blocks }) => blocks[0]?.height ?? 0);
  }, [indexerGraphClient]);

  return useQuery(["block_count", indexerGraphClient], queryFn);
};

export const useBlockDetailsQuery = (
  height: number
): UseQueryResult<BlockDetails | null> => {
  const chainId = useChainId();
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getBlockDetailsByHeightQueryDocument, { height })
      .then<BlockDetails | null>(({ blocks_by_pk }) =>
        blocks_by_pk
          ? {
              network: chainId,
              hash: parseTxHash(blocks_by_pk.hash),
              height: blocks_by_pk.height,
              timestamp: parseDate(blocks_by_pk.timestamp),
              gasUsed:
                blocks_by_pk.transactions_aggregate.aggregate?.sum?.gas_used,
              gasLimit:
                blocks_by_pk.transactions_aggregate.aggregate?.sum?.gas_limit,
            }
          : null
      );
  }, [indexerGraphClient, chainId, height]);

  return useQuery(["block_details", indexerGraphClient, height], queryFn, {
    keepPreviousData: true,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
