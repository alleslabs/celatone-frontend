import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useLcdEndpoint,
} from "lib/app-provider";
import type { BlocksResponse } from "lib/services/types";
import type { BlockData } from "lib/types";

import { getBlockData, getBlocks } from "./api";
import { getBlockDataLcd, getLatestBlockLcd } from "./lcd";

export const useBlocks = (
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<BlocksResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("blocks");
  return useQuery<BlocksResponse>(
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

export const useBlockDataLcd = (height: number) => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCK_DATA_LCD, endpoint, height],
    async () => getBlockDataLcd(endpoint, height),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useLatestBlockLcd = () => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCK_LATEST_HEIGHT_LCD, endpoint],
    async () => getLatestBlockLcd(endpoint),
    {
      retry: false,
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  );
};
