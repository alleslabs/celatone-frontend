import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type {
  Nullable,
  BechAddr,
  BechAddr20,
  BechAddr32,
  HexAddr20,
  Option,
  PoolTxFilter,
  Transaction,
  TransactionWithSignerPubkey,
  TxFilters,
} from "lib/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useEvmConfig,
  useInitia,
  useMoveConfig,
  usePoolConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import { createQueryFnWithTimeout } from "lib/services/utils";
import { zHexAddr20 } from "lib/types";
import {
  convertAccountPubkeyToAccountAddress,
  extractTxLogs,
  isTxHash,
} from "lib/utils";
import { useCallback } from "react";

import type {
  AccountTxsResponse,
  BlockTxsResponse,
  TxData,
  TxsResponse,
} from "../types";

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
  getCosmosTxHashByEvmTxHash,
  getEvmTxHashByCosmosTxHash,
  getEvmTxHashesByCosmosTxHashes,
  getTxDataJsonRpc,
  getTxsDataJsonRpc,
} from "./jsonRpc";
import {
  getTxDataRest,
  getTxsByAccountAddressRest,
  getTxsByContractAddressRest,
  getTxsByHashRest,
} from "./rest";
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
  const {
    currentChainId,
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("txs");

  const endpoint = isFullTier ? apiEndpoint : restEndpoint;

  const queryFn = useCallback(
    async (hash: Option<string>) => {
      if (!hash) throw new Error("hash is undefined (useTxData)");

      const txData = isFullTier
        ? await getTxData(endpoint, hash)
        : await getTxDataRest(endpoint, hash);

      const { txResponse } = txData;

      const logs = extractTxLogs(txResponse);

      return {
        ...txResponse,
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
      staleTime: Infinity,
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
  const endpoint = useBaseApiRoute("pools");
  const { enabled: poolEnable } = usePoolConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID,
      endpoint,
      poolId,
      type,
      limit,
      offset,
      poolEnable,
    ],
    async () => {
      if (!poolEnable) throw new Error("Pool is not enabled (useTxsByPoolId)");

      return getTxsByPoolId(endpoint, poolId, type, limit, offset);
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTxsByPoolIdTableCounts = (
  poolId: number,
  type: PoolTxFilter
) => {
  const endpoint = useBaseApiRoute("pools");
  const { enabled: poolEnable } = usePoolConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID_COUNT,
      endpoint,
      poolId,
      type,
      poolEnable,
    ],
    async () => {
      if (!poolEnable)
        throw new Error("Pool is not enabled (useTxsByPoolIdTableCounts)");

      return getTxsByPoolIdTableCounts(endpoint, poolId, type);
    },
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
      if (!address) throw new Error("address is undefined (useTxsByAddress)");
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

export const useTxsByContractAddressRest = (
  address: BechAddr32,
  limit: number,
  offset: number,
  options: UseQueryOptions<TxsResponse> = {}
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(
    () =>
      getTxsByContractAddressRest(restEndpoint, address, limit, offset).then(
        (txs) => ({
          items: txs.items.map<Transaction>((tx) => ({
            ...tx,
            sender: convertAccountPubkeyToAccountAddress(
              tx.signerPubkey,
              bech32Prefix
            ),
          })),
          total: txs.total,
        })
      ),
    [address, restEndpoint, limit, offset, bech32Prefix]
  );

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_CONTRACT_ADDRESS_REST,
      restEndpoint,
      address,
      limit,
      offset,
    ],
    queryfn,
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useTxsByAddressRest = (
  address: Option<BechAddr20>,
  search: Option<string>,
  limit: number,
  offset: number,
  options: UseQueryOptions<TxsResponse> = {}
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(async () => {
    const txs = await (async () => {
      if (search && isTxHash(search)) {
        const txsByHash = await getTxsByHashRest(restEndpoint, search);

        if (txsByHash.total === 0)
          throw new Error("transaction not found (getTxsByHashRest)");

        const tx = txsByHash.items[0];
        const sender = convertAccountPubkeyToAccountAddress(
          tx.signerPubkey,
          bech32Prefix
        );

        if (address === sender) return txsByHash;

        throw new Error("address is not equal to sender (getTxsByHashRest)");
      }

      if (search && !isTxHash(search))
        throw new Error("search is not a tx hash (useTxsByAddressRest)");

      if (!address)
        throw new Error("address is undefined (useTxsByAddressRest)");
      return getTxsByAccountAddressRest(restEndpoint, address, limit, offset);
    })();

    return {
      items: txs.items.map<Transaction>((tx) => ({
        ...tx,
        sender: convertAccountPubkeyToAccountAddress(
          tx.signerPubkey,
          bech32Prefix
        ),
      })),
      total: txs.total,
    };
  }, [address, restEndpoint, limit, offset, bech32Prefix, search]);

  return useQuery<TxsResponse>(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_REST,
      restEndpoint,
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
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(
    async (pageParam: Option<string>) => {
      return getTxsSequencer(restEndpoint, pageParam, limit);
    },
    [restEndpoint, limit]
  );

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.TXS_SEQUENCER, restEndpoint, limit],
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
          bech32Prefix
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
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.TXS_COUNT_SEQUENCER, restEndpoint],
    async () => getTxsCountSequencer(restEndpoint),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

const mapTxsByAddressSequencerItems = (
  prefix: string,
  address: Option<BechAddr20>,
  items: Option<TransactionWithSignerPubkey[]>
) =>
  items?.map((item) => {
    const sender = convertAccountPubkeyToAccountAddress(
      item.signerPubkey,
      prefix
    );

    return {
      ...item,
      sender,
      isSigner: sender === address,
    };
  });

export const useTxsByAddressSequencer = (
  address: Option<BechAddr20>,
  search: Option<string>,
  limit = 10
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(
    async (pageParam: Option<string>) => {
      return (async () => {
        if (search && isTxHash(search)) {
          const txsByHash = await getTxsByHashSequencer(restEndpoint, search);

          if (txsByHash.pagination.total === 0)
            throw new Error("transaction not found (getTxsByHashSequencer)");

          const tx = txsByHash.items[0];
          const sender = convertAccountPubkeyToAccountAddress(
            tx.signerPubkey,
            bech32Prefix
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
          endpoint: restEndpoint,
          address,
          paginationKey: pageParam,
          limit,
        });
      })();
    },
    [address, restEndpoint, bech32Prefix, search, limit]
  );

  const { data, ...rest } = useInfiniteQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_SEQUENCER,
      restEndpoint,
      address,
      search,
      limit,
    ],
    ({ pageParam }) => queryfn(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return {
    ...rest,
    data: data?.pages.flatMap(
      (page) =>
        mapTxsByAddressSequencerItems(bech32Prefix, address, page.items) ?? []
    ),
    latestFetchedData: mapTxsByAddressSequencerItems(
      bech32Prefix,
      address,
      data?.pages[data.pages.length - 1].items
    ),
  };
};

export const useTxsByAddressPaginationSequencer = (
  address: BechAddr20,
  paginationKey: Option<string>,
  limit = 10,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_PAGINATION_SEQUENCER,
      restEndpoint,
      address,
      paginationKey,
      limit,
    ],
    () =>
      getTxsByAccountAddressSequencer({
        endpoint: restEndpoint,
        address,
        paginationKey,
        limit,
      }),
    {
      enabled,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const useTxsByBlockHeightSequencer = (height: number) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT_SEQUENCER,
      restEndpoint,
      height,
      bech32Prefix,
    ],
    async () => {
      const txs = await getTxsByBlockHeightSequencer(restEndpoint, height);

      return txs.map<Transaction>((tx) => ({
        ...tx,
        sender: convertAccountPubkeyToAccountAddress(
          tx.signerPubkey,
          bech32Prefix
        ),
      }));
    },
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useEvmTxHashByCosmosTxHash = (cosmosTxHash: Option<string>) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_TX_HASH_BY_COSMOS_TX_HASH,
      evm.enabled && evm.jsonRpc,
      cosmosTxHash ?? "",
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxHashByCosmosTxHash)");
      if (!cosmosTxHash)
        throw new Error(
          "cosmosTxHash is undefined (useEvmTxHashByCosmosTxHash)"
        );

      return getEvmTxHashByCosmosTxHash(evm.jsonRpc, cosmosTxHash);
    },
    {
      enabled: evm.enabled && !!evm.jsonRpc && !!cosmosTxHash,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
};

export const useEvmTxHashesByCosmosTxHashes = (
  cosmosTxHashes: Option<string[]>,
  enabled = true
) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.EVM_TX_HASHES_BY_COSMOS_TX_HASHES,
      evm.enabled && evm.jsonRpc,
      cosmosTxHashes ?? [],
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxHashesByCosmosTxHashes)");
      if (!cosmosTxHashes)
        throw new Error(
          "cosmosTxHashes is undefined (useEvmTxHashesByCosmosTxHashes)"
        );

      if (!cosmosTxHashes.length) return [];
      return getEvmTxHashesByCosmosTxHashes(evm.jsonRpc, cosmosTxHashes);
    },
    {
      enabled: enabled && evm.enabled && !!evm.jsonRpc && !!cosmosTxHashes,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

export const useEvmTxDataJsonRpc = (evmTxHash: string, enabled = true) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TX_DATA_JSON_RPC,
      evm.enabled && evm.jsonRpc,
      evmTxHash,
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxDataJsonRpc)");

      return getTxDataJsonRpc(evm.jsonRpc, evmTxHash);
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
      enabled: enabled && evm.enabled && !!evm.jsonRpc,
    }
  );
};

export const useCosmosTxHashByEvmTxHash = (evmTxHash: Option<string>) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.COSMOS_TX_HASH_BY_EVM_TX_HASH,
      evm.enabled && evm.jsonRpc,
      evmTxHash,
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useCosmosTxHashByEvmTxHash)");
      if (!evmTxHash)
        throw new Error("evmTxHash is undefined (useCosmosTxHashByEvmTxHash)");

      return getCosmosTxHashByEvmTxHash(evm.jsonRpc, evmTxHash);
    },
    {
      enabled: evm.enabled && !!evm.jsonRpc && !!evmTxHash,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
};

export const useEvmTxsDataJsonRpc = (
  evmTxHashes: Option<string[]>,
  enabled = true
) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.TXS_DATA_JSON_RPC,
      evm.enabled && evm.jsonRpc,
      evmTxHashes ?? [],
    ],
    async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxsDataJsonRpc)");
      if (!evmTxHashes)
        throw new Error("evmTxHashes is undefined (useEvmTxsDataJsonRpc)");

      if (!evmTxHashes.length) return [];
      return getTxsDataJsonRpc(evm.jsonRpc, evmTxHashes);
    },
    {
      enabled: enabled && evm.enabled && !!evm.jsonRpc && !!evmTxHashes,
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );
};

const useCosmosTxDataByEvmTxHash = (evmTxHash: Option<string>) => {
  const { data: cosmosTxHash, isFetching: isCosmosTxHashFetching } =
    useCosmosTxHashByEvmTxHash(evmTxHash);
  const { data: txData, isFetching: isTxDataFetching } =
    useTxData(cosmosTxHash);
  return {
    data: txData,
    isFetching: isCosmosTxHashFetching || isTxDataFetching,
  };
};

export const useCreatedContractsByEvmTxHash = (
  evmTxHash: Option<string>,
  evmTxContract: Nullable<HexAddr20>
) => {
  const { data: cosmosTxData, isFetching } =
    useCosmosTxDataByEvmTxHash(evmTxHash);

  const contracts =
    cosmosTxData?.events
      .filter((event) => event.type === "contract_created")
      .map((event) => zHexAddr20.parse(event.attributes[0].value)) ?? [];

  return {
    data: evmTxContract
      ? [
          evmTxContract,
          ...contracts.filter((contract) => contract !== evmTxContract),
        ]
      : contracts,
    isFetching,
  };
};

export * from "./simulateFee";
export * from "./simulateFeeEvm";
