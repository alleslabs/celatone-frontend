import type { Addr, HexAddr, Option } from "lib/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useEvmConfig,
} from "lib/app-provider";

import {
  getEvmInternalTxsByAccountAddressSequencer,
  getEvmInternalTxsByBlockHeightSequencer,
  getEvmInternalTxsByTxHashSequencer,
} from "./sequencer";

export const useEvmInternalTxsByBlockHeightSequencer = (
  height: number,
  limit: number = 10
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  return useInfiniteQuery({
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
        pageParam
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });
};

export const useEvmInternalTxsByTxHashSequencer = (
  txHash: Option<HexAddr>,
  limit: number = 10,
  enabled: boolean = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  return useInfiniteQuery({
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
        pageParam
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    enabled: enabled && !!txHash,
  });
};

export const useEvmInternalTxsByAccountAddressSequencer = (
  address: Option<Addr>,
  limit: number = 10,
  enabled: boolean = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  return useInfiniteQuery({
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
        pageParam
      );
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    enabled: enabled && !!address,
  });
};
