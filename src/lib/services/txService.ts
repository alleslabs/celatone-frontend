import { useWallet } from "@cosmos-kit/react";
import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp, useChainId } from "lib/app-provider";
import {
  getExecuteTxsByContractAddressPagination,
  getExecuteTxsCountByContractAddress,
  getTxsByContractAddressPagination,
  getTxsCountByContractAddress,
} from "lib/query";
import { MsgFurtherAction } from "lib/types";
import type { Addr, ContractAddr, Option, Transaction } from "lib/types";
import {
  formatStdFee,
  getActionMsgType,
  parseDateOpt,
  parseTxHash,
  snakeToCamel,
  unwrapAll,
} from "lib/utils";

import type { TxResponse } from "./tx";
import { queryTxData } from "./tx";

export interface TxData extends TxResponse {
  chainId: string;
  formattedFee: Option<string>;
}

export const useTxData = (txHash: Option<string>): UseQueryResult<TxData> => {
  const { currentChainName } = useWallet();
  const chainId = useChainId();
  const queryFn = useCallback(
    async ({ queryKey }: QueryFunctionContext<string[]>) => {
      const txData = await queryTxData(queryKey[1], queryKey[2], queryKey[3]);
      return {
        ...txData,
        chainId,
        formattedFee: txData.tx.auth_info.fee?.amount.length
          ? formatStdFee(txData.tx.auth_info.fee)
          : undefined,
      };
    },
    [chainId]
  );

  return useQuery({
    queryKey: ["tx_data", currentChainName, chainId, txHash] as string[],
    queryFn,
    enabled: !!txHash,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useExecuteTxsByContractAddressPagination = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getExecuteTxsByContractAddressPagination, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions_view }) =>
        /**
         * @remarks because contract_transactions_view is view table, all fields can be undefined by type
         */
        contract_transactions_view.map((transaction) => ({
          hash: parseTxHash(transaction.hash),
          messages: snakeToCamel(transaction.messages),
          sender: transaction.sender as Addr,
          height: transaction.height,
          created: parseDateOpt(transaction.timestamp),
          success: transaction.success,
          actionMsgType: getActionMsgType([
            /* these value must not be null */
            unwrapAll(transaction.is_execute),
            unwrapAll(transaction.is_instantiate),
            unwrapAll(transaction.is_send),
            unwrapAll(transaction.is_store_code),
            unwrapAll(transaction.is_migrate),
            unwrapAll(transaction.is_update_admin),
            unwrapAll(transaction.is_clear_admin),
          ]),
          furtherAction: MsgFurtherAction.NONE,
          isIbc: transaction.is_ibc,
          isInstantiate: transaction.is_instantiate,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "execute_transactions_by_contract_addr_pagination",
      contractAddress,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useExecuteTxsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (useExecuteTxsCountByContractAddress)"
      );

    return indexerGraphClient
      .request(getExecuteTxsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate?.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    [
      "execute_transactions_count_by_contract_addr",
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useTxsByContractAddressPagination = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getTxsByContractAddressPagination, {
        contractAddress,
        offset,
        pageSize,
      })
      .then(({ contract_transactions_view }) =>
        /**
         * @remarks because contract_transactions_view is view table, all fields can be undefined by type
         */
        contract_transactions_view.map((contractTx) => ({
          hash: parseTxHash(contractTx.hash),
          messages: snakeToCamel(contractTx.messages),
          sender: contractTx.sender as Addr,
          height: contractTx.height,
          created: parseDateOpt(contractTx.timestamp),
          success: contractTx.success,
          actionMsgType: getActionMsgType([
            /* these value must not be null */
            unwrapAll(contractTx.is_execute),
            unwrapAll(contractTx.is_instantiate),
            unwrapAll(contractTx.is_send),
            unwrapAll(contractTx.is_store_code),
            unwrapAll(contractTx.is_migrate),
            unwrapAll(contractTx.is_update_admin),
            unwrapAll(contractTx.is_clear_admin),
          ]),
          furtherAction: MsgFurtherAction.NONE,
          isIbc: contractTx.is_ibc,
          isInstantiate: contractTx.is_instantiate,
        }))
      );
  }, [contractAddress, offset, pageSize, indexerGraphClient]);

  return useQuery(
    [
      "transactions_by_contract_addr_pagination",
      contractAddress,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};

export const useTxsCountByContractAddress = (
  contractAddress: ContractAddr
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!contractAddress)
      throw new Error(
        "Contract address not found (useTxsCountByContractAddress)"
      );

    return indexerGraphClient
      .request(getTxsCountByContractAddress, {
        contractAddress,
      })
      .then(
        ({ contract_transactions_aggregate }) =>
          contract_transactions_aggregate.aggregate?.count
      );
  }, [contractAddress, indexerGraphClient]);

  return useQuery(
    [
      "transactions_count_by_contract_addr",
      contractAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!contractAddress,
    }
  );
};
