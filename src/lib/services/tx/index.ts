import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type {
  BechAddr,
  BechAddr20,
  BechAddr32,
  HexAddr20,
  Nullable,
  Option,
  PoolTxFilter,
  TransactionWithTxResponse,
  TxFilters,
} from "lib/types";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
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
import { useTxDecoderContext } from "lib/providers/tx-decoder";
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
  RawTxResponse,
  TxData,
<<<<<<< HEAD
=======
  TxsResponse,
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
  TxsResponseItemFromRest,
  TxsResponseWithTxResponse,
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

export const useTxDecoder = (rawTxResponse: Option<RawTxResponse>) => {
<<<<<<< HEAD
  const evm = useEvmConfig({ shouldRedirect: false });
  const { txDecoder } = useTxDecoderContext();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.TX_DECODER,
      rawTxResponse,
      evm.enabled,
      evm.enabled && evm.jsonRpc,
    ],
    queryFn: async () =>
      evm.enabled
        ? txDecoder.decodeEvmTransaction(rawTxResponse)
        : txDecoder.decodeTransaction(rawTxResponse),
    enabled: !!rawTxResponse,
  });
=======
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const txDecoder = useMemo(
    () => new TxDecoder({ restUrl: restEndpoint }),
    [restEndpoint]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.TX_DECODER, rawTxResponse?.txhash],
    async () => txDecoder.decodeTransaction(rawTxResponse),
    {
      enabled: !!rawTxResponse,
    }
  );
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
};

export const useTxData = (
  txHash: Option<string>,
  enabled = true
): UseQueryResult<TxData> => {
  const { bech32Prefix } = useCurrentChain();
  const {
    chainConfig: { rest: restEndpoint },
    currentChainId,
  } = useCelatoneApp();
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("txs");
  const { txDecoder } = useTxDecoderContext();
  const evm = useEvmConfig({ shouldRedirect: false });

  const endpoint = isFullTier ? apiEndpoint : restEndpoint;

  const queryFn = useCallback(
    async (hash: Option<string>) => {
      if (!hash) throw new Error("hash is undefined (useTxData)");

      const txData = isFullTier
        ? await getTxData(endpoint, hash)
        : await getTxDataRest(endpoint, hash);

      const { rawTxResponse, txResponse } = txData;

      const signer = convertAccountPubkeyToAccountAddress(
        txResponse.tx.authInfo.signerInfos[0].publicKey,
        bech32Prefix
      );

      const logs = extractTxLogs(rawTxResponse);
<<<<<<< HEAD
      const decodedTx = await (evm.enabled
        ? txDecoder.decodeEvmTransaction(rawTxResponse)
        : txDecoder.decodeTransaction(rawTxResponse));
=======
      const decodedTx = await txDecoder.decodeTransaction(rawTxResponse);
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
      return {
        ...txResponse,
        chainId: currentChainId,
        decodedTx,
        isTxFailed: Boolean(txResponse.code),
        logs,
        signer,
      };
    },
    [bech32Prefix, currentChainId, endpoint, isFullTier, txDecoder, evm.enabled]
  );

  return useQuery({
    enabled: enabled && Boolean(txHash && isTxHash(txHash)),
    queryFn: async () => queryFn(txHash),
    queryKey: [
      CELATONE_QUERY_KEYS.TX_DATA,
      endpoint,
      txHash,
      bech32Prefix,
      evm.enabled,
    ],
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useTxs = (limit: number, offset: number) => {
  const endpoint = useBaseApiRoute("txs");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

<<<<<<< HEAD
  return useQuery<TxsResponseWithTxResponse>({
    queryKey: [
=======
  return useQuery<TxsResponseWithTxResponse>(
    [
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
      CELATONE_QUERY_KEYS.TXS,
      endpoint,
      limit,
      offset,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
    queryFn: async () =>
      getTxs(endpoint, limit, offset, wasmEnable, moveEnable, isInitia),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useTxsByPoolId = (
  poolId: number,
  type: PoolTxFilter,
  limit: number,
  offset: number
) => {
  const endpoint = useBaseApiRoute("pools");
  const { enabled: poolEnable } = usePoolConfig({ shouldRedirect: false });

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID,
      endpoint,
      poolId,
      type,
      limit,
      offset,
      poolEnable,
    ],
    queryFn: async () => {
      if (!poolEnable) throw new Error("Pool is not enabled (useTxsByPoolId)");

      return getTxsByPoolId(endpoint, poolId, type, limit, offset);
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useTxsByPoolIdTableCounts = (
  poolId: number,
  type: PoolTxFilter
) => {
  const endpoint = useBaseApiRoute("pools");
  const { enabled: poolEnable } = usePoolConfig({ shouldRedirect: false });

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.POOL_TRANSACTION_BY_ID_COUNT,
      endpoint,
      poolId,
      type,
      poolEnable,
    ],
    queryFn: async () => {
      if (!poolEnable)
        throw new Error("Pool is not enabled (useTxsByPoolIdTableCounts)");

      return getTxsByPoolIdTableCounts(endpoint, poolId, type);
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useTxsByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  limit: number,
  offset: number
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<AccountTxsResponse>({
    queryKey: [
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
      isInitia,
    ],
    queryFn: async () => {
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
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useTxsByBlockHeight = (
  height: number,
  limit: number,
  offset: number
) => {
  const endpoint = useBaseApiRoute("blocks");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });
  const { enabled: moveEnable } = useMoveConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  return useQuery<BlockTxsResponse>({
    enabled: !!height,
    placeholderData: keepPreviousData,
    queryFn: async () =>
      getTxsByBlockHeight(
        endpoint,
        height,
        limit,
        offset,
        wasmEnable,
        moveEnable,
        isInitia
      ),
    queryKey: [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT,
      endpoint,
      limit,
      offset,
      height,
      wasmEnable,
      moveEnable,
      isInitia,
    ],
  });
};

export const useTxsCountByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters
) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled: wasmEnable } = useWasmConfig({ shouldRedirect: false });

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.TXS_COUNT_BY_ADDRESS,
      endpoint,
      address,
      search,
      isSigner,
      JSON.stringify(txFilters),
      wasmEnable,
    ],
    queryFn: async () => {
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
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useTxsByContractAddressRest = (
  address: BechAddr32,
  limit: number,
<<<<<<< HEAD
  offset: number
=======
  offset: number,
  options: UseQueryOptions<TxsResponseWithTxResponse> = {}
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(
    () =>
      getTxsByContractAddressRest(restEndpoint, address, limit, offset).then(
        (txs) => ({
          items: txs.items.map<TransactionWithTxResponse>((tx) => ({
            ...tx.item,
            rawTxResponse: tx.rawTxResponse,
            sender: convertAccountPubkeyToAccountAddress(
              tx.item.signerPubkey,
              bech32Prefix
            ),
            txResponse: tx.txResponse,
          })),
          total: txs.total,
        })
      ),
    [address, restEndpoint, limit, offset, bech32Prefix]
  );

<<<<<<< HEAD
  return useQuery<TxsResponseWithTxResponse>({
    queryKey: [
=======
  return useQuery<TxsResponseWithTxResponse>(
    [
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
      CELATONE_QUERY_KEYS.TXS_BY_CONTRACT_ADDRESS_REST,
      restEndpoint,
      address,
      limit,
      offset,
      bech32Prefix,
    ],
    queryFn: queryfn,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useTxsByAddressRest = (
  address: Option<BechAddr20>,
  search: Option<string>,
  limit: number,
  offset: number,
<<<<<<< HEAD
  options: Partial<UseQueryOptions<TxsResponseWithTxResponse>> = {}
=======
  options: UseQueryOptions<TxsResponseWithTxResponse> = {}
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
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
          tx.item.signerPubkey,
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
      items: txs.items.map<TransactionWithTxResponse>((tx) => ({
        ...tx.item,
        rawTxResponse: tx.rawTxResponse,
        sender: convertAccountPubkeyToAccountAddress(
          tx.item.signerPubkey,
          bech32Prefix
        ),
        txResponse: tx.txResponse,
      })),
      total: txs.total,
    };
  }, [address, restEndpoint, limit, offset, bech32Prefix, search]);

<<<<<<< HEAD
  return useQuery<TxsResponseWithTxResponse>({
    queryKey: [
=======
  return useQuery<TxsResponseWithTxResponse>(
    [
>>>>>>> abdb52010 (feat(utils): add tx with tx response)
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_REST,
      restEndpoint,
      address,
      search,
      limit,
      offset,
      bech32Prefix,
    ],
    queryFn: createQueryFnWithTimeout(queryfn, 20000),
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useTxsSequencer = (limit = 10) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(
    async (pageParam: Option<string>) => {
      return getTxsSequencer(indexerEndpoint, pageParam, limit);
    },
    [indexerEndpoint, limit]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [CELATONE_QUERY_KEYS.TXS_SEQUENCER, indexerEndpoint, limit],
    queryFn: ({ pageParam }: { pageParam?: string }) => queryfn(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.pages.flatMap<TransactionWithTxResponse>((page) =>
      page.items.map((item: TxsResponseItemFromRest) => {
        const sender = convertAccountPubkeyToAccountAddress(
          item.item.signerPubkey,
          bech32Prefix
        );

        return {
          ...item.item,
          rawTxResponse: item.rawTxResponse,
          sender,
          txResponse: item.txResponse,
        };
      })
    ),
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useTxsCountSequencer = () => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery({
    queryKey: [CELATONE_QUERY_KEYS.TXS_COUNT_SEQUENCER, indexerEndpoint],
    queryFn: async () => getTxsCountSequencer(indexerEndpoint),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const mapTxsByAddressSequencerItems = (
  prefix: string,
  address: Option<BechAddr>,
  items: Option<TxsResponseItemFromRest[]>
) =>
  items?.map((item: TxsResponseItemFromRest) => {
    const sender = convertAccountPubkeyToAccountAddress(
      item.item.signerPubkey,
      prefix
    );

    return {
      ...item.item,
      isSigner: address === sender,
      rawTxResponse: item.rawTxResponse,
      sender,
      txResponse: item.txResponse,
    };
  });

export const useTxsByAddressSequencer = (
  address: Option<BechAddr>,
  search: Option<string>,
  limit = 10
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  const queryfn = useCallback(
    async (pageParam: Option<string>) => {
      return (async () => {
        if (search && isTxHash(search)) {
          const txsByHash = await getTxsByHashSequencer(
            indexerEndpoint,
            search
          );

          if (txsByHash.pagination.total === 0)
            throw new Error("transaction not found (getTxsByHashSequencer)");

          const tx = txsByHash.items[0];
          const sender = convertAccountPubkeyToAccountAddress(
            tx.item.signerPubkey,
            bech32Prefix
          );

          if (address === sender) return txsByHash;

          const findAddressFromEvents = tx.item.events?.some((event) =>
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
          address,
          endpoint: indexerEndpoint,
          limit,
          paginationKey: pageParam,
        });
      })();
    },
    [address, indexerEndpoint, bech32Prefix, search, limit]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_SEQUENCER,
      indexerEndpoint,
      address,
      search,
      limit,
    ],
    queryFn: ({ pageParam }: { pageParam?: string }) => queryfn(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    data: data?.pages.flatMap<TransactionWithTxResponse>(
      (page) =>
        mapTxsByAddressSequencerItems(bech32Prefix, address, page.items) ?? []
    ),
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
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
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery({
    enabled,
    queryFn: () =>
      getTxsByAccountAddressSequencer({
        address,
        endpoint: indexerEndpoint,
        limit,
        paginationKey,
      }),
    queryKey: [
      CELATONE_QUERY_KEYS.TXS_BY_ADDRESS_PAGINATION_SEQUENCER,
      indexerEndpoint,
      address,
      paginationKey,
      limit,
    ],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useTxsByBlockHeightSequencer = (height: number) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const { bech32Prefix } = useCurrentChain();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.TXS_BY_BLOCK_HEIGHT_SEQUENCER,
      indexerEndpoint,
      height,
      bech32Prefix,
    ],
    queryFn: async () => {
      const txs = await getTxsByBlockHeightSequencer(indexerEndpoint, height);

      return txs.map<TransactionWithTxResponse>((tx) => ({
        ...tx.item,
        rawTxResponse: tx.rawTxResponse,
        sender: convertAccountPubkeyToAccountAddress(
          tx.item.signerPubkey,
          bech32Prefix
        ),
        txResponse: tx.txResponse,
      }));
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useEvmTxHashByCosmosTxHash = (cosmosTxHash: Option<string>) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery({
    enabled: evm.enabled && !!evm.jsonRpc && !!cosmosTxHash,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxHashByCosmosTxHash)");
      if (!cosmosTxHash)
        throw new Error(
          "cosmosTxHash is undefined (useEvmTxHashByCosmosTxHash)"
        );

      return getEvmTxHashByCosmosTxHash(evm.jsonRpc, cosmosTxHash);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_TX_HASH_BY_COSMOS_TX_HASH,
      evm.enabled && evm.jsonRpc,
      cosmosTxHash ?? "",
    ],
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });
};

export const useEvmTxHashesByCosmosTxHashes = (
  cosmosTxHashes: Option<string[]>,
  enabled = true
) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery({
    enabled: enabled && evm.enabled && !!evm.jsonRpc && !!cosmosTxHashes,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxHashesByCosmosTxHashes)");
      if (!cosmosTxHashes)
        throw new Error(
          "cosmosTxHashes is undefined (useEvmTxHashesByCosmosTxHashes)"
        );

      if (!cosmosTxHashes.length) return [];
      return getEvmTxHashesByCosmosTxHashes(evm.jsonRpc, cosmosTxHashes);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_TX_HASHES_BY_COSMOS_TX_HASHES,
      evm.enabled && evm.jsonRpc,
      cosmosTxHashes ?? [],
    ],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useEvmTxDataJsonRpc = (evmTxHash: string, enabled = true) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.TX_DATA_JSON_RPC,
      evm.enabled && evm.jsonRpc,
      evmTxHash,
    ],
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxDataJsonRpc)");

      return getTxDataJsonRpc(evm.jsonRpc, evmTxHash);
    },
    enabled: enabled && evm.enabled && !!evm.jsonRpc,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useCosmosTxHashByEvmTxHash = (evmTxHash: Option<string>) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery({
    enabled: evm.enabled && !!evm.jsonRpc && !!evmTxHash,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useCosmosTxHashByEvmTxHash)");
      if (!evmTxHash)
        throw new Error("evmTxHash is undefined (useCosmosTxHashByEvmTxHash)");

      return getCosmosTxHashByEvmTxHash(evm.jsonRpc, evmTxHash);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.COSMOS_TX_HASH_BY_EVM_TX_HASH,
      evm.enabled && evm.jsonRpc,
      evmTxHash,
    ],
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });
};

export const useEvmTxsDataJsonRpc = (
  evmTxHashes: Option<string[]>,
  enabled = true
) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return useQuery({
    enabled: enabled && evm.enabled && !!evm.jsonRpc && !!evmTxHashes,
    queryFn: async () => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxsDataJsonRpc)");
      if (!evmTxHashes)
        throw new Error("evmTxHashes is undefined (useEvmTxsDataJsonRpc)");

      if (!evmTxHashes.length) return [];
      return getTxsDataJsonRpc(evm.jsonRpc, evmTxHashes);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.TXS_DATA_JSON_RPC,
      evm.enabled && evm.jsonRpc,
      evmTxHashes ?? [],
    ],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
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
