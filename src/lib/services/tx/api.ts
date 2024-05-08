import { useQuery } from "@tanstack/react-query";
import type {
  QueryFunctionContext,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useInitia,
  useMoveConfig,
  useWasmConfig,
} from "lib/app-provider";
import type { BechAddr, Option, TxFilters } from "lib/types";
import {
  camelToSnake,
  extractTxLogs,
  isTxHash,
  parseDateOpt,
  parseWithError,
} from "lib/utils";

import type {
  AccountTxsResponse,
  BlockTxsResponse,
  TxData,
  TxResponse,
  TxsResponse,
} from "./types";
import {
  zAccountTxsResponse,
  zBlockTxsResponse,
  zTxsCountResponse,
  zTxsResponse,
} from "./types";

const queryTxData = async (
  txsApiRoute: string,
  txHash: string
): Promise<TxResponse> => {
  const { data } = await axios.get(`${txsApiRoute}/${txHash.toUpperCase()}`);

  return {
    ...data.tx_response,
    timestamp: parseDateOpt(data.tx_response.timestamp),
  };
};

export const useTxData = (
  txHash: Option<string>,
  enabled = true
): UseQueryResult<TxData> => {
  const { currentChainId } = useCelatoneApp();
  const txsApiRoute = useBaseApiRoute("txs");
  const queryFn = useCallback(
    async ({ queryKey }: QueryFunctionContext<string[]>): Promise<TxData> => {
      const txData = await queryTxData(queryKey[1], queryKey[2]);
      const logs = extractTxLogs(txData);
      return {
        ...txData,
        logs,
        chainId: currentChainId,
        isTxFailed: Boolean(txData.code),
      };
    },
    [currentChainId]
  );

  return useQuery({
    queryKey: [CELATONE_QUERY_KEYS.TX_DATA, txsApiRoute, txHash] as string[],
    queryFn,
    enabled: enabled && Boolean(txHash && isTxHash(txHash)),
    refetchOnWindowFocus: false,
    retry: false,
  });
};

const getTxs = async (
  endpoint: string,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
      },
    })
    .then(({ data }) => parseWithError(zTxsResponse, data));

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

const getTxsByAddress = async (
  endpoint: string,
  address: BechAddr,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) => {
  const filterParams = camelToSnake<TxFilters>(txFilters);

  return axios
    .get(`${endpoint}/${encodeURIComponent(address)}/txs`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
        ...filterParams,
        ...(isSigner !== undefined && { is_signer: isSigner }),
        ...(search !== undefined && { search }),
      },
    })
    .then(({ data }) => parseWithError(zAccountTxsResponse, data));
};

export const useTxsByAddress = (
  address: Option<BechAddr>,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  offset: number,
  limit: number
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
    { retry: 1, refetchOnWindowFocus: false }
  );
};

const getTxsByBlockHeight = async (
  endpoint: string,
  height: number,
  limit: number,
  offset: number,
  isWasm: boolean,
  isMove: boolean,
  isInitia: boolean
) =>
  axios
    .get(`${endpoint}/${height}/txs`, {
      params: {
        limit,
        offset,
        is_wasm: isWasm,
        is_move: isMove,
        is_initia: isInitia,
      },
    })
    .then(({ data }) => parseWithError(zBlockTxsResponse, data));

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

const getTxsCountByAddress = async (
  endpoint: string,
  address: BechAddr,
  search: Option<string>,
  isSigner: Option<boolean>,
  txFilters: TxFilters,
  isWasm: boolean
) => {
  const filterParams = camelToSnake<TxFilters>(txFilters);

  return axios
    .get(`${endpoint}/${encodeURIComponent(address)}/txs-count`, {
      params: {
        ...filterParams,
        is_wasm: isWasm, // only for `searching` contract txs
        ...(isSigner !== undefined && { is_signer: isSigner }),
        ...(search !== undefined && { search }),
      },
    })
    .then(({ data }) => parseWithError(zTxsCountResponse, data));
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
      if (!address) throw new Error("address is undefined");
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
