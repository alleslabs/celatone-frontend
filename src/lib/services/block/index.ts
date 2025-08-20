import type { UseQueryOptions } from "@tanstack/react-query";
import type { BlocksResponse } from "lib/services/types";
import type { BlockData, ConsensusAddr, Option, Transaction } from "lib/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useEvmConfig,
} from "lib/app-provider";
import {
  convertAccountPubkeyToAccountAddress,
  convertRawConsensusAddrToConsensusAddr,
} from "lib/utils";

import { getBlockData, getBlocks } from "./api";
import { getBlockDataJsonRpc } from "./jsonRpc";
import { getBlockDataRest, getLatestBlockRest } from "./rest";
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
    { ...options, refetchOnWindowFocus: false, retry: 1 }
  );
};

export const useBlockData = (height: number, enabled = true) => {
  const endpoint = useBaseApiRoute("blocks");

  return useQuery<BlockData>(
    [CELATONE_QUERY_KEYS.BLOCK_DATA, endpoint, height],
    async () => getBlockData(endpoint, height),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};

export const useBlockDataRest = (height: number, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery<{
    block: BlockData;
    proposerConsensusAddress: ConsensusAddr;
    transactions: Transaction[];
  }>(
    [CELATONE_QUERY_KEYS.BLOCK_DATA_REST, restEndpoint, height],
    async () => {
      const { rawProposerConsensusAddress, transactions, ...rest } =
        await getBlockDataRest(restEndpoint, height);
      return {
        ...rest,
        proposerConsensusAddress: convertRawConsensusAddrToConsensusAddr(
          rawProposerConsensusAddress,
          bech32Prefix
        ),
        transactions: transactions.map<Transaction>((tx) => ({
          ...tx,
          sender: convertAccountPubkeyToAccountAddress(
            tx.signerPubkey,
            bech32Prefix
          ),
        })),
      };
    },
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};

export const useLatestBlockRest = () => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCK_LATEST_HEIGHT_REST, restEndpoint],
    async () => getLatestBlockRest(restEndpoint),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};

export const useBlocksSequencer = (limit = 10) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      [CELATONE_QUERY_KEYS.BLOCKS_SEQUENCER, indexerEndpoint, limit],
      async ({ pageParam }) =>
        getBlocksSequencer(indexerEndpoint, pageParam, limit),
      {
        getNextPageParam: (lastPage) =>
          lastPage.pagination.nextKey ?? undefined,
        refetchOnWindowFocus: false,
      }
    );

  return {
    data: data?.pages.flatMap((page) => page.blocks),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useBlockTimeAverageSequencer = () => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.BLOCK_TIME_AVERAGE_SEQUENCER, indexerEndpoint],
    async () => getBlockTimeAverageSequencer(indexerEndpoint),
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};

export const useBlockDataSequencer = (height: number) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery<BlockData>(
    [CELATONE_QUERY_KEYS.BLOCK_DATA_SEQUENCER, indexerEndpoint, height],
    async () => getBlockDataSequencer(indexerEndpoint, height),
    {
      refetchOnWindowFocus: false,
      retry: false,
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
      enabled: enabled && evm.enabled && !!evm.jsonRpc && !!height,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};
