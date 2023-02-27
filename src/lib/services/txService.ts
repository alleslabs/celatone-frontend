import type {
  QueryFunctionContext,
  UseQueryResult,
} from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { useChainId, useLCDEndpoint } from "lib/hooks";
import {
  getTxsByContractAddressPagination,
  getTxsCountByContractAddress,
} from "lib/query";
import type { Addr, AllTransaction, ContractAddr, Option } from "lib/types";
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
  const lcdEndpoint = useLCDEndpoint();
  const chainId = useChainId();
  const queryFn = useCallback(
    async ({ queryKey }: QueryFunctionContext) => {
      const txData = await queryTxData(
        queryKey.at(1) as string,
        queryKey.at(2) as string
      );
      return {
        ...txData,
        chainId,
        formattedFee: txData.tx.value.fee.amount.length
          ? formatStdFee(txData.tx.value.fee)
          : undefined,
      };
    },
    [chainId]
  );

  return useQuery({
    queryKey: ["tx_data", lcdEndpoint, txHash],
    queryFn,
    enabled: !!txHash,
    refetchOnWindowFocus: false,
  });
};

export const useTxsByContractAddressPagination = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): UseQueryResult<AllTransaction[]> => {
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
          isIbc: contractTx.is_ibc,
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
