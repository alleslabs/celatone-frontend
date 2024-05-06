import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { BlocksResponse } from "lib/services/types";
import { zBlockDataResponse, zBlocksResponse } from "lib/services/types";
import type { BlockData } from "lib/types";
import { parseWithError } from "lib/utils";

const getBlocks = async (endpoint: string, limit: number, offset: number) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zBlocksResponse, data));

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

const getBlockData = async (endpoint: string, height: number) =>
  axios
    .get(`${endpoint}/${height}/info`)
    .then(({ data }) => parseWithError(zBlockDataResponse, data));

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
