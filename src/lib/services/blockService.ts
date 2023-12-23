import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { BlockData } from "lib/types";

import { getBlocks, type BlocksResponse, getBlockData } from "./block";

export const useBlocks = (
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<BlocksResponse, Error>,
    "onSuccess" | "onError"
  > = {}
) => {
  const endpoint = useBaseApiRoute("blocks");
  return useQuery<BlocksResponse, Error>(
    [CELATONE_QUERY_KEYS.BLOCKS, endpoint, limit, offset],
    async () => getBlocks(endpoint, limit, offset),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useBlockData = (height: number, enabled = true) => {
  const endpoint = useBaseApiRoute("blocks");

  return useQuery<BlockData>(
    [CELATONE_QUERY_KEYS.BLOCK_DATA, endpoint, height],
    async () => getBlockData(endpoint, height),
    {
      enabled,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};
