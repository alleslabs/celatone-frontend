import type { Addr, HexAddr, Option } from "lib/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useEvmConfig,
} from "lib/app-provider";
import { useCountQuery } from "lib/hooks/useCountQuery";

import type { UseEvmInternalTxsQueryResult } from "../types";

import {
  getEvmInternalTxsByAccountAddressSequencer,
  getEvmInternalTxsByBlockHeightSequencer,
  getEvmInternalTxsByTxHashSequencer,
} from "./sequencer";

export const useEvmInternalTxsByBlockHeightSequencer = (
  height: number,
  limit: number = 10
): UseEvmInternalTxsQueryResult => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  const dataQuery = useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_INTERNAL_TXS_BY_BLOCK_HEIGHT_SEQUENCER,
      evm.enabled,
      indexerEndpoint,
      height,
      limit,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxsByBlockHeightSequencer)");

      return getEvmInternalTxsByBlockHeightSequencer(
        indexerEndpoint,
        height,
        limit,
        pageParam,
        false
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });

  const countQuery = useCountQuery(
    [
      CELATONE_QUERY_KEYS.EVM_INTERNAL_TXS_BY_BLOCK_HEIGHT_SEQUENCER,
      evm.enabled,
      indexerEndpoint,
      height,
      "count",
    ],
    async () => {
      if (!evm.enabled) return 0;
      const result = await getEvmInternalTxsByBlockHeightSequencer(
        indexerEndpoint,
        height,
        1,
        undefined,
        true
      );
      return result.pagination.total ?? 0;
    },
    evm.enabled
  );

  return {
    // eslint-disable-next-line @tanstack/query/no-rest-destructuring
    ...dataQuery,
    countError: countQuery.error ?? undefined,
    isCountLoading: countQuery.isLoading,
    totalCount: countQuery.data,
  } as UseEvmInternalTxsQueryResult;
};

export const useEvmInternalTxsByTxHashSequencer = (
  txHash: Option<HexAddr>,
  limit: number = 10,
  enabled: boolean = true
): UseEvmInternalTxsQueryResult => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  const dataQuery = useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_INTERNAL_TXS_BY_TX_HASH_SEQUENCER,
      evm.enabled,
      txHash,
      indexerEndpoint,
      limit,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxsByTxHashSequencer)");

      if (!txHash)
        throw new Error("txHash is invalid (useEvmTxsByTxHashSequencer)");

      return getEvmInternalTxsByTxHashSequencer(
        indexerEndpoint,
        txHash,
        limit,
        pageParam,
        false
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    enabled: enabled && !!txHash,
  });

  const countQuery = useCountQuery(
    [
      CELATONE_QUERY_KEYS.EVM_INTERNAL_TXS_BY_TX_HASH_SEQUENCER,
      evm.enabled,
      txHash,
      indexerEndpoint,
      "count",
    ],
    async () => {
      if (!evm.enabled || !txHash) return 0;
      const result = await getEvmInternalTxsByTxHashSequencer(
        indexerEndpoint,
        txHash,
        1,
        undefined,
        true
      );
      return result.pagination.total ?? 0;
    },
    enabled && evm.enabled && !!txHash
  );

  return {
    // eslint-disable-next-line @tanstack/query/no-rest-destructuring
    ...dataQuery,
    countError: countQuery.error ?? undefined,
    isCountLoading: countQuery.isLoading,
    totalCount: countQuery.data,
  } as UseEvmInternalTxsQueryResult;
};

export const useEvmInternalTxsByAccountAddressSequencer = (
  address: Option<Addr>,
  limit: number = 10,
  enabled: boolean = true
): UseEvmInternalTxsQueryResult => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  const dataQuery = useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_INTERNAL_TXS_BY_ACCOUNT_ADDRESS_SEQUENCER,
      evm.enabled,
      address,
      indexerEndpoint,
      limit,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!evm.enabled)
        throw new Error(
          "EVM is not enabled (useEvmInternalTxsByAccountAddressSequencer)"
        );

      if (!address)
        throw new Error(
          "address is invalid (useEvmInternalTxsByAccountAddressSequencer)"
        );

      return getEvmInternalTxsByAccountAddressSequencer(
        indexerEndpoint,
        address,
        limit,
        pageParam,
        false
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    enabled: enabled && !!address,
  });

  const countQuery = useCountQuery(
    [
      CELATONE_QUERY_KEYS.EVM_INTERNAL_TXS_BY_ACCOUNT_ADDRESS_SEQUENCER,
      evm.enabled,
      address,
      indexerEndpoint,
      "count",
    ],
    async () => {
      if (!evm.enabled || !address) return 0;
      const result = await getEvmInternalTxsByAccountAddressSequencer(
        indexerEndpoint,
        address,
        1,
        undefined,
        true
      );
      return result.pagination.total ?? 0;
    },
    enabled && evm.enabled && !!address
  );

  return {
    // eslint-disable-next-line @tanstack/query/no-rest-destructuring
    ...dataQuery,
    countError: countQuery.error ?? undefined,
    isCountLoading: countQuery.isLoading,
    totalCount: countQuery.data,
  } as UseEvmInternalTxsQueryResult;
};
