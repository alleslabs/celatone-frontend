import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useCallback } from "react";

import type {
  AccountTxsResponse,
  BlockTxsResponse,
  TxData,
  TxsResponse,
} from "../types";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useInitia,
  useLcdEndpoint,
  useMoveConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { createQueryFnWithTimeout } from "lib/services/utils";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  Option,
  PoolTxFilter,
  Transaction,
  TxFilters,
} from "lib/types";
import {
  convertAccountPubkeyToAccountAddress,
  extractTxLogs,
  isTxHash,
  snakeToCamel,
} from "lib/utils";

import {
  getTxData,
  getTxs,
  getTxsByAddress,
  getTxsByBlockHeight,
  getTxsByPoolId,
  getTxsByPoolIdTableCounts,
  getTxsCountByAddress,
} from "./api";
import {
  getTxDataLcd,
  getTxsByAccountAddressLcd,
  getTxsByContractAddressLcd,
  getTxsByHashLcd,
} from "./lcd";
import {
  getTxsByAccountAddressSequencer,
  getTxsByBlockHeightSequencer,
  getTxsByHashSequencer,
  getTxsCountSequencer,
  getTxsSequencer,
} from "./sequencer";

export const useTxData = (
  txHash: Option<string>,
  enabled = true
): UseQueryResult<TxData> => {
  const { currentChainId } = useCelatoneApp();
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("txs");
  const lcdEndpoint = useLcdEndpoint();

  const endpoint = isFullTier ? apiEndpoint : lcdEndpoint;

  const queryFn = useCallback(
    async (hash: Option<string>) => {
      if (!hash) throw new Error("CELATONE_QUERY_KEYS.TX_DATA is undefined");

      const txData = isFullTier
        ? await getTxData(endpoint, hash)
        : await getTxDataLcd(endpoint, hash);

      const { txResponse } = txData;

      const logs = extractTxLogs(txResponse);

      const payload = snakeToCamel(txResponse);

      return {
        ...payload,
        logs,
        chainId: currentChainId,
        isTxFailed: Boolean(txResponse.code),
      };
    },
    [currentChainId, endpoint, isFullTier]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.TX_DATA, endpoint, txHash],
    async () => queryFn(txHash),
    {
      enabled: enabled && Boolean(txHash && isTxHash(txHash)),
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxs = (
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<TxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS,
      endpoint,
      limit,
      offset,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    async () =>
      getTxs(endpoint, limit, offset, wasmEnable, moveEnable, isInitia),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByPoolId = (
  poolId: number,
  type: PoolTxFilter,
  limit: number,
  offset: number
) => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID,
      endpoint,
      poolId,
      type,
      limit,
      offset,
      wasmEnable,
    ],
    async () => getTxsByPoolId(endpoint, poolId, type, limit, offset),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxsByPoolIdTableCounts = (poolId: number) => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID_COUNT,
      endpoint,
      poolId,
      wasmEnable,
    ],
    async () => getTxsByPoolIdTableCounts(endpoint, poolId),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxsByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  limit: number,
  offset: number,
  options: UseQueryOptions<AccountTxsResponse> = {}
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<AccountTxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
      limit,
      offset,
      isWasm,
      isMove,
    ],
    async () => {
      if (!address) throw new Error("No user address");
      return getTxsByAddress(
        endpoint,
        address,
        search,
        isSigner,
        txFilters,
        limit,
        offset,
        isWasm,
        isMove,
        isInitia
      );
    },
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useTxsByBlockHeight = (
  height: number,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<BlockTxsResponse>, "onSuccess"> = {}
) => {
  const endpoint = useBaseApiRoute("blocks");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<BlockTxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT,
      endpoint,
      limit,
      offset,
      height,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    async () =>
      getTxsByBlockHeight(
        endpoint,
        height,
        limit,
        offset,
        wasmEnable,
        moveEnable,
        isInitia
      ),
    {
      ...options,
      keepPreviousData: true,
      enabled: !!height,
    }
  );
};

export const useTxsCountByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_COUNT_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
    ],
    async () => {
      if (!address)
        throw new Error("address is undefined (useTxsCountByAddress)");
      return getTxsCountByAddress(
        endpoint,
        address,
        search,
        isSigner,
        txFilters,
        wasmEnable
      );
    },
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByContractAddressLcd = (
  address: BechAddr32,
  limit: number,
  offset: number,
  options: UseQueryOptions<TxsResponse> = {}
) => {
  const endpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  const queryfn = useCallback(
    () =>
      getTxsByContractAddressLcd(endpoint, address, limit, offset).then(
        (txs) => ({
          items: txs.items.map<Transaction>((tx) => ({
            ...tx,
            sender: convertAccountPubkeyToAccountAddress(
              tx.signerPubkey,
              prefix
            ),
          })),
          total: txs.total,
        })
      ),
    [address, endpoint, limit, offset, prefix]
  );

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_CONTRACT_ADDRESS_LCD,
      endpoint,
      address,
      limit,
      offset,
    ],
    queryfn,
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useTxsByAddressLcd = (
  address: Option<BechAddr20>,
  search: Option<string>,
  limit: number,
  offset: number,
  options: UseQueryOptions<TxsResponse> = {}
) => {
  const endpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const queryfn = useCallback(async () => {
    const txs = await (async () => {
      if (search && isTxHash(search)) {
        const txsByHash = await getTxsByHashLcd(endpoint, search);

        if (txsByHash.total === 0)
          throw new Error("transaction not found (getTxsByHashLcd)");

        const tx = txsByHash.items[0];
        const sender = convertAccountPubkeyToAccountAddress(
          tx.signerPubkey,
          prefix
        );

        if (address === sender) return txsByHash;

        throw new Error("address is not equal to sender (getTxsByHashLcd)");
      }

      if (search && !isTxHash(search))
        throw new Error("search is not a tx hash (useTxsByAddressLcd)");

      if (!address)
        throw new Error("address is undefined (useTxsByAddressLcd)");
      return getTxsByAccountAddressLcd(endpoint, address, limit, offset);
    })();

    return {
      items: txs.items.map<Transaction>((tx) => ({
        ...tx,
        sender: convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix),
      })),
      total: txs.total,
    };
  }, [address, endpoint, limit, offset, prefix, search]);

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_LCD,
      endpoint,
      address,
      search,
      limit,
      offset,
    ],
    createQueryFnWithTimeout(queryfn, 20000),
    { ...options, retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsSequencer = (limit = 10) => {
  const endpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  const queryfn = useCallback(
    async (pageParam: Option<string>) => {
      return getTxsSequencer(endpoint, pageParam, limit);
    },
    [endpoint, limit]
  );

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.TXS_SEQUENCER, endpoint, limit],
    ({ pageParam }) => queryfn(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...rest,
    data: data?.pages.flatMap<Transaction>((page) =>
      page.items.map((item) => {
        const sender = convertAccountPubkeyToAccountAddress(
          item.signerPubkey,
          prefix
        );

        return {
          ...item,
          sender,
        };
      })
    ),
  };
};

export const useTxsCountSequencer = () => {
  const endpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.TXS_COUNT_SEQUENCER, endpoint],
    async () => getTxsCountSequencer(endpoint),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useTxsByAddressSequencer = (
  address: Option<BechAddr20>,
  search: Option<string>,
  limit = 10
) => {
  const endpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  const queryfn = useCallback(
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async (pageParam: Option<string>) => {
      return (async () => {
        if (search && isTxHash(search)) {
          const txsByHash = await getTxsByHashSequencer(endpoint, search);

          if (txsByHash.pagination.total === 0)
            throw new Error("transaction not found (getTxsByHashSequencer)");

          const tx = txsByHash.items[0];
          const sender = convertAccountPubkeyToAccountAddress(
            tx.signerPubkey,
            prefix
          );

          if (address === sender) return txsByHash;

          const findAddressFromEvents = tx.events?.some((event) =>
            event.attributes.some((attr) => attr.value === address)
          );

          if (findAddressFromEvents) return txsByHash;

          throw new Error(
            "transaction is not related (useTxsByAddressSequncer)"
          );
        }

        if (search && !isTxHash(search))
          throw new Error("search is not a tx hash (useTxsByAddressSequncer)");

        if (!address)
          throw new Error("address is undefined (useTxsByAddressSequncer)");

        return getTxsByAccountAddressSequencer({
          endpoint,
          address,
          paginationKey: pageParam,
          limit,
        });
      })();
    },
    [address, endpoint, prefix, search, limit]
  );

  const { data, ...rest } = useInfiniteQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_SEQUENCER,
      endpoint,
      address,
      search,
      limit,
    ],
    ({ pageParam }) => queryfn(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...rest,
    data: data?.pages.flatMap((page) =>
      page.items.map((item) => {
        const sender = convertAccountPubkeyToAccountAddress(
          item.signerPubkey,
          prefix
        );

        return {
          ...item,
          sender,
          isSigner: sender === address,
        };
      })
    ),
  };
};

export const useTxsByBlockHeightSequencer = (height: number) => {
  const endpoint = useLcdEndpoint();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT_SEQUENCER, endpoint, height],
    async ({ pageParam }) => {
      const { txs, pagination } = await getTxsByBlockHeightSequencer(
        endpoint,
        height,
        pageParam
      );

      return {
        txs: txs.map<Transaction>((tx) => ({
          ...tx,
          sender: convertAccountPubkeyToAccountAddress(tx.signerPubkey, prefix),
        })),
        pagination,
      };
    },
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    data: data?.pages.flatMap((page) => page.txs),
    ...rest,
  };
};
