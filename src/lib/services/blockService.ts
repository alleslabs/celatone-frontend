import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getBlockCountQueryDocument,
  getBlockListQueryDocument,
} from "lib/query";
import type { BlockInfo } from "lib/types";
import { parseDate, parseTxHash } from "lib/utils";

export const useBlocklistQuery = (
  limit: number,
  offset: number
): UseQueryResult<BlockInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getBlockListQueryDocument, { limit, offset })
      .then(({ blocks }) =>
        blocks.map<BlockInfo>(
          ({ hash, height, timestamp, transactions_aggregate }) => ({
            hash: parseTxHash(hash),
            height: height.toString(),
            timestamp: parseDate(timestamp),
            txCount: transactions_aggregate.aggregate?.count ?? 0,
          })
        )
      );
  }, [indexerGraphClient, limit, offset]);

  return useQuery(["blocks", indexerGraphClient, limit, offset], queryFn);
};

export const useBlockCountQuery = (): UseQueryResult<number> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getBlockCountQueryDocument)
      .then(({ blocks }) => blocks.at(0)?.height ?? 0);
  }, [indexerGraphClient]);

  return useQuery(["block_count", indexerGraphClient], queryFn);
};
