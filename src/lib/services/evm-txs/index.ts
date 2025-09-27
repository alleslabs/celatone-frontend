import { useInfiniteQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useEvmConfig,
} from "lib/app-provider";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { type Addr, type Option, zAddr } from "lib/types";
import { isTxHash } from "lib/utils";

import {
  getBlockDataJsonRpc,
  getBlockDataJsonRpcByBlockNumbers,
} from "../block/jsonRpc";
import { getTxsDataJsonRpc } from "../tx/jsonRpc";
import {
  getEvmTxsByAccountAddressSequencer,
  getEvmTxsByBlockHeightSequencer,
  getEvmTxsByTxHashSequencer,
  getEvmTxsSequencer,
} from "./sequencer";

export const useEvmTxsByBlockHeightSequencer = (
  height: number,
  limit: number = 10
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });

  const jsonRpc = evm.enabled ? evm.jsonRpc : "";

  return useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_TXS_BY_BLOCK_HEIGHT_SEQUENCER,
      indexerEndpoint,
      height,
      limit,
      evm.enabled,
      jsonRpc,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!evm.enabled)
        throw new Error("EVM is not enabled (useEvmTxsByBlockHeightSequencer)");

      const [txs, blockDataJsonRpc] = await Promise.all([
        getEvmTxsByBlockHeightSequencer(
          indexerEndpoint,
          height,
          limit,
          pageParam
        ),
        getBlockDataJsonRpc(jsonRpc, height),
      ]);

      const blockTimestamp = blockDataJsonRpc.block.timestamp;
      const txsWithRpcData = {
        ...txs,
        txs: txs.txs.map((tx, index) => {
          const rpcTx = blockDataJsonRpc?.block.transactions[index];

          return {
            ...tx,
            input: rpcTx?.input,
            timestamp: blockTimestamp,
            value: rpcTx?.value,
          };
        }),
      };

      return txsWithRpcData;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useEvmTxs = (limit: number = 10) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });
  const jsonRpc = evm.enabled ? evm.jsonRpc : "";

  return useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_TXS_SEQUENCER,
      indexerEndpoint,
      limit,
      evm.enabled,
      jsonRpc,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!evm.enabled) throw new Error("EVM is not enabled (useEvmTxs)");

      const txs = await getEvmTxsSequencer(indexerEndpoint, limit, pageParam);

      const [txsDataJsonRpc, blockDataJsonRpc] = await Promise.all([
        getTxsDataJsonRpc(
          jsonRpc,
          txs.txs.map((tx) => tx.transactionHash)
        ),
        getBlockDataJsonRpcByBlockNumbers(
          jsonRpc,
          txs.txs.map((tx) => tx.blockNumber)
        ),
      ]);

      const txsWithRpcData = {
        ...txs,
        txs: txs.txs.map((tx, index) => {
          const timestamp = blockDataJsonRpc[index].block.timestamp;
          const rpcTx = txsDataJsonRpc[index].tx;

          return {
            ...tx,
            input: rpcTx.input,
            timestamp,
            value: rpcTx.value,
          };
        }),
      };

      return txsWithRpcData;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useEvmTxsByAccountAddressSequencer = (
  address: Option<Addr>,
  search: Option<string>,
  limit: number = 10,
  enabled: boolean = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const evm = useEvmConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  const jsonRpc = evm.enabled ? evm.jsonRpc : "";

  return useInfiniteQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.EVM_TXS_BY_ACCOUNT_ADDRESS_SEQUENCER,
      indexerEndpoint,
      limit,
      evm.enabled,
      jsonRpc,
      address,
      search,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      if (!evm.enabled)
        throw new Error(
          "EVM is not enabled (useEvmTxsByAccountAddressSequencer)"
        );

      if (search && isTxHash(search)) {
        const foundTx = await getEvmTxsByTxHashSequencer(
          indexerEndpoint,
          search
        );

        const { tx } = foundTx;

        const parsedAddress = zAddr.safeParse(address);

        if (!parsedAddress.success)
          throw new Error(
            "address is invalid (useEvmTxsByAccountAddressSequencer)"
          );

        if (
          tx.from.toLowerCase() !==
          formatAddresses(parsedAddress.data).hex?.toLowerCase()
        )
          throw new Error("tx not found for this address");

        const [txsDataJsonRpc, blockDataJsonRpc] = await Promise.all([
          getTxsDataJsonRpc(jsonRpc, [tx.transactionHash]),
          getBlockDataJsonRpcByBlockNumbers(jsonRpc, [tx.blockNumber]),
        ]);

        const timestamp = blockDataJsonRpc[0].block.timestamp;
        const rpcTx = txsDataJsonRpc[0].tx;

        return {
          pagination: {
            nextKey: null,
            total: 1,
          },
          txs: [
            {
              ...tx,
              input: rpcTx.input,
              timestamp,
              value: rpcTx.value,
            },
          ],
        };
      }

      if (search && !isTxHash(search))
        throw new Error(
          "search is not a tx hash (useEvmTxsByAccountAddressSequencer)"
        );

      if (!address)
        throw new Error(
          "address is undefined (useEvmTxsByAccountAddressSequencer)"
        );

      const txs = await getEvmTxsByAccountAddressSequencer(
        indexerEndpoint,
        address,
        limit,
        pageParam
      );

      const [txsDataJsonRpc, blockDataJsonRpc] = await Promise.all([
        getTxsDataJsonRpc(
          jsonRpc,
          txs.txs.map((tx) => tx.transactionHash)
        ),
        getBlockDataJsonRpcByBlockNumbers(
          jsonRpc,
          txs.txs.map((tx) => tx.blockNumber)
        ),
      ]);

      const txsWithRpcData = {
        ...txs,
        txs: txs.txs.map((tx, index) => {
          const timestamp = blockDataJsonRpc[index].block.timestamp;
          const rpcTx = txsDataJsonRpc[index].tx;

          return {
            ...tx,
            input: rpcTx.input,
            timestamp,
            value: rpcTx.value,
          };
        }),
      };

      return txsWithRpcData;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: enabled && evm.enabled && !!address,
  });
};
