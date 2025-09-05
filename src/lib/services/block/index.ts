// import type { UseQueryOptions } from "@tanstack/react-query";
import type { BlocksResponse } from "lib/services/types";
import type {
  BlockData,
  ConsensusAddr,
  Option,
  TransactionWithTxResponse,
} from "lib/types";

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
  offset: number
  // options: Pick<UseQueryOptions<BlocksResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("blocks");
  return useQuery<BlocksResponse>({
    queryFn: async () => getBlocks(endpoint, limit, offset),
    queryKey: [CELATONE_QUERY_KEYS.BLOCKS, endpoint, limit, offset],
    // ...options,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useBlockData = (height: number, enabled = true) => {
  const endpoint = useBaseApiRoute("blocks");

  return useQuery<BlockData>({
    enabled,
    queryFn: async () => getBlockData(endpoint, height),
    queryKey: [CELATONE_QUERY_KEYS.BLOCK_DATA, endpoint, height],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBlockDataRest = (height: number, enabled = true) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery<{
    block: BlockData;
    proposerConsensusAddress: ConsensusAddr;
    transactions: TransactionWithTxResponse[];
  }>({
    queryFn: async () => {
      const { rawProposerConsensusAddress, transactions, ...rest } =
        await getBlockDataRest(restEndpoint, height);
      return {
        ...rest,
        proposerConsensusAddress: convertRawConsensusAddrToConsensusAddr(
          rawProposerConsensusAddress,
          bech32Prefix
        ),
        transactions: transactions.map<TransactionWithTxResponse>((tx) => ({
          ...tx.item,
          rawTxResponse: tx.rawTxResponse,
          sender: convertAccountPubkeyToAccountAddress(
            tx.item.signerPubkey,
            bech32Prefix
          ),
          txResponse: tx.txResponse,
        })),
      };
    },
    queryKey: [
      CELATONE_QUERY_KEYS.BLOCK_DATA_REST,
      restEndpoint,
      height,
      bech32Prefix,
    ],
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useLatestBlockRest = () => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    gcTime: 0,
    queryFn: async () => getLatestBlockRest(restEndpoint),
    queryKey: [CELATONE_QUERY_KEYS.BLOCK_LATEST_HEIGHT_REST, restEndpoint],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBlocksSequencer = (limit = 10) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [CELATONE_QUERY_KEYS.BLOCKS_SEQUENCER, indexerEndpoint, limit],
      queryFn: async ({ pageParam }: { pageParam?: string }) =>
        getBlocksSequencer(indexerEndpoint, pageParam, limit),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    });

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

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.BLOCK_TIME_AVERAGE_SEQUENCER,
      indexerEndpoint,
    ],
    queryFn: async () => getBlockTimeAverageSequencer(indexerEndpoint),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBlockDataSequencer = (height: number) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery<BlockData>({
    queryKey: [
      CELATONE_QUERY_KEYS.BLOCK_DATA_SEQUENCER,
      indexerEndpoint,
      height,
    ],
    queryFn: async () => getBlockDataSequencer(indexerEndpoint, height),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useBlockDataJsonRpc = (height: Option<number>, enabled = true) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery({
    enabled: enabled && evm.enabled && !!evm.jsonRpc && !!height,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useBlockDataJsonRpc)");

      if (!height)
        throw new Error("Height is not provided (useBlockDataJsonRpc)");

      return getBlockDataJsonRpc(evm.jsonRpc, height);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.BLOCK_DATA_JSON_RPC,
      evm.enabled && evm.jsonRpc,
      height,
    ],
    refetchOnWindowFocus: false,
    retry: false,
  });
};
