import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
  useEvmConfig,
  useLcdEndpoint,
} from "lib/app-provider";
import type { BlocksResponse } from "lib/services/types";
import type { BlockData, ConsensusAddr, Option, Transaction } from "lib/types";
import {
  convertAccountPubkeyToAccountAddress,
  convertRawConsensusAddrToConsensusAddr,
} from "lib/utils";

import { getBlockData, getBlocks } from "./api";
import { getBlockDataJsonRpc } from "./jsonRpc";
import { getBlockDataLcd, getLatestBlockLcd } from "./lcd";
import {
  getBlockDataSequencer,
  getBlocksSequencer,
  getBlockTimeAverageSequencer,
} from "./sequencer";

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

export const useBlockDataLcd = (height: number, enabled = true) => {
  const endpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  return useQuery<{
    block: BlockData;
    proposerConsensusAddress: ConsensusAddr;
    transactions: Transaction[];
  }>(
    [CELATONE_QUERY_KEYS.BLOCK_DATA_LCD, endpoint, height],
    async () => {
      const { rawProposerConsensusAddress, transactions, ...rest } =
        await getBlockDataLcd(endpoint, height);
      return {
        ...rest,
        proposerConsensusAddress: convertRawConsensusAddrToConsensusAddr(
          rawProposerConsensusAddress,
          prefix
        ),
        transactions: transactions.map<Transaction>((tx) => ({
          ...tx,
          sender: convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix),
        })),
      };
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled,
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

export const useBlocksSequencer = (limit = 10) => {
  const endpoint = useLcdEndpoint();

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.BLOCKS_SEQUENCER, endpoint, limit],
    async ({ pageParam }) => getBlocksSequencer(endpoint, pageParam, limit),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: data?.pages.flatMap((page) => page.blocks),
    ...rest,
  };
};

export const useBlockTimeAverageSequencer = () => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCK_TIME_AVERAGE_SEQUENCER, endpoint],
    async () => getBlockTimeAverageSequencer(endpoint),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useBlockDataSequencer = (height: number) => {
  const endpoint = useLcdEndpoint();

  return useQuery<BlockData>(
    [CELATONE_QUERY_KEYS.BLOCK_DATA_SEQUENCER, endpoint, height],
    async () => getBlockDataSequencer(endpoint, height),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useBlockDataJsonRpc = (height: Option<number>, enabled = true) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.BLOCK_DATA_JSON_RPC,
      evm.enabled && evm.jsonRpc,
      height,
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useBlockDataJsonRpc)");

      if (!height)
        throw new Error("Height is not provided (useBlockDataJsonRpc)");

      return getBlockDataJsonRpc(evm.jsonRpc, height);
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: enabled && evm.enabled && !!evm.jsonRpc && !!height,
    }
  );
};
