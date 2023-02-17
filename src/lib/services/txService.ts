import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getTxsByContractAddressPagination,
  getTxsCountByContractAddress,
} from "lib/query/tx";
import type { Addr, AllTransaction, ContractAddr, Option } from "lib/types";
import {
  getActionMsgType,
  parseDateOpt,
  parseTxHash,
  snakeToCamel,
  unwrapAll,
} from "lib/utils";

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
