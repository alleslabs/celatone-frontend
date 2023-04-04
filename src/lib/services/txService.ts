import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  GetTxsByAddressPaginationDocument,
  GetTxsCountByAddressDocument,
} from "lib/gql/graphql";
import type { Addr, Option, Transaction, TxFilters } from "lib/types";
import {
  getActionMsgType,
  getMsgFurtherAction,
  parseDateOpt,
  parseTxHash,
  snakeToCamel,
} from "lib/utils";

import { useTxExpression } from "./expression";

export const useTxsByAddressPagination = (
  address: Option<Addr>,
  search: string,
  filters: TxFilters,
  relation: Option<boolean>,
  offset: number,
  pageSize: number
): UseQueryResult<Transaction[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression(address, search, filters, relation);

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(GetTxsByAddressPaginationDocument, {
        expression,
        offset,
        pageSize,
      })
      .then(({ account_transactions }) =>
        /**
         * @remarks because contract_transactions_view is view table, all fields can be undefined by type
         */
        account_transactions.map((tx) => ({
          hash: parseTxHash(tx.transaction.hash),
          messages: snakeToCamel(tx.transaction.messages),
          sender: tx.transaction.account.address as Addr,
          isSigner: tx.is_signer,
          height: tx.block.height,
          created: parseDateOpt(tx.block.timestamp),
          success: tx.transaction.success,
          actionMsgType: getActionMsgType([
            /* these value must not be null */
            tx.transaction.is_execute,
            tx.transaction.is_instantiate,
            tx.transaction.is_send,
            tx.transaction.is_store_code,
            tx.transaction.is_migrate,
            tx.transaction.is_update_admin,
            tx.transaction.is_clear_admin,
          ]),
          furtherAction: getMsgFurtherAction(
            tx.transaction.messages.length,
            {
              isExecute: tx.transaction.is_execute,
              isInstantiate: tx.transaction.is_instantiate,
              isSend: tx.transaction.is_send,
              isUpload: tx.transaction.is_store_code,
              isMigrate: tx.transaction.is_migrate,
              isUpdateAdmin: tx.transaction.is_update_admin,
              isClearAdmin: tx.transaction.is_clear_admin,
              isIbc: tx.transaction.is_ibc,
            },
            tx.transaction.success,
            tx.is_signer
          ),
          isIbc: tx.transaction.is_ibc,
          isInstantiate: tx.transaction.is_instantiate,
        }))
      );
  }, [expression, indexerGraphClient, offset, pageSize]);

  return useQuery(
    [
      "transactions_by_address_pagination",
      address,
      search,
      filters,
      relation,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn,
    {
      enabled: !!address,
    }
  );
};

export const useTxsCountByAddress = (
  address: Option<Addr>,
  search: string,
  filters: TxFilters,
  relation: Option<boolean>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = useTxExpression(address, search, filters, relation);

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(GetTxsCountByAddressDocument, {
        expression,
      })
      .then(
        ({ account_transactions_aggregate }) =>
          account_transactions_aggregate.aggregate?.count
      );
  }, [expression, indexerGraphClient]);

  return useQuery(
    [
      "transactions_count_by_address",
      address,
      search,
      filters,
      relation,
      indexerGraphClient,
    ],
    queryFn,
    {
      enabled: !!address,
    }
  );
};
