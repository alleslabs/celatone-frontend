import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { request } from "graphql-request";

import { OSMOSIS_TESTNET_GQL_ENDPOINT } from "lib/env";
import type { Transaction } from "lib/types/tx/transaction";
import { snakeToCamel } from "lib/utils/formatter";

import {
  queryAddrFromContracts,
  queryShowallFromTxs,
  queryWithActionsFromTxs,
} from "./graphqlQuery";

interface Action {
  execute: boolean;
  instantiate: boolean;
  upload: boolean;
  ibc: boolean;
  send: boolean;
}

interface Response {
  transactions: Array<Transaction>;
  count: number;
}

const actions = {
  execute: "is_execute",
  instantiate: "is_instantiate",
  upload: "is_store_code",
  ibc: "is_ibc",
  send: "is_send",
};

export const useTxQuery = (
  userAddr: string | undefined,
  execute: boolean,
  instantiate: boolean,
  upload: boolean,
  ibc: boolean,
  send: boolean,
  search: string,
  pageSize: number,
  offset: number
) => {
  const { currentChainName } = useWallet();
  // Filter when action buttons are pressed
  const actionsFilter = () => {
    const actionsObj = {
      execute,
      instantiate,
      upload,
      send,
      ibc,
    };

    let filter = "";
    Object.keys(actionsObj).forEach((key) => {
      if (actionsObj[key as keyof typeof actionsObj]) {
        // Remove message that contain only ibc
        if (key === "ibc") {
          filter += `
          
            _and: [
              { is_ibc: { _eq: true} }
              {
                _or: [
                  { is_execute: { _neq: false } }
                  { is_instantiate: { _neq: false } }
                  { is_store_code: { _neq: false } }
                  { is_send: { _neq: false } }
                ]
              }
            ]
          
          `;
        } else {
          filter += `${actions[key as keyof Action]}: {_eq: true}`;
          filter += `,`;
        }
      }
    });

    // Remove last ,
    filter = filter.substring(0, filter.length - 1);
    return filter;
  };

  const queryFn = async (): Promise<Response> => {
    // Determine endpoint
    let endpoint = "";
    if (currentChainName === "osmosistestnet") {
      endpoint = OSMOSIS_TESTNET_GQL_ENDPOINT;
    }
    if (endpoint === "" || userAddr === "") {
      return { transactions: [], count: 0 } as Response;
    }

    // Tx hash and no search -> query from transactions table
    if (search.length === 64 || search.length === 0) {
      const isShowAll = !execute && !instantiate && !upload && !ibc && !send;
      // Show all 4 main action types
      let response;
      if (isShowAll) {
        response = await request(endpoint, queryShowallFromTxs(search), {
          userAddr,
          pageSize,
          offset,
        });
        // When buttons are pressed
      } else {
        response = await request(
          endpoint,
          queryWithActionsFromTxs(search, actionsFilter()),
          {
            userAddr,
            pageSize,
            offset,
          }
        );
      }
      return snakeToCamel({
        transactions: response.transactions,
        count: response.transactions_aggregate?.aggregate?.count,
      }) as Response;

      // Contract address -> query from contracts table
    }
    if (search.length === 63) {
      const response = await request(
        endpoint,
        queryAddrFromContracts(actionsFilter()),
        {
          userAddr,
          contractAddr: search,
          pageSize,
          offset,
        }
      );
      return snakeToCamel({
        transactions: response.contract_transactions.map(
          (tx: { transaction: Transaction }) => tx.transaction
        ),
        count: response.contract_transactions_aggregate?.aggregate?.count,
      }) as Response;
    }
    return { transactions: [], count: 0 } as Response;
  };
  return useQuery({
    queryKey: ["transaction", userAddr, search],
    queryFn,
    refetchInterval: 2000,
  });
};
