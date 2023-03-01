import { gql } from "graphql-request";

export const queryTransactionsFromTxs = (where: string) => {
  return gql`
    query QueryTransactionsFromTxs($pageSize: Int!, $offset: Int!) {
      transactions(
        where: ${where}
        limit: $pageSize
        offset: $offset
        order_by: {block: {timestamp: desc}}
      ) {
          hash
          sender
          block_height
          is_send
          is_execute
          is_ibc
          is_instantiate
          is_store_code
          is_clear_admin
          is_migrate
          is_update_admin
          messages
          success
          block {
            timestamp
          }
      }

    }`;
};

export const queryTransactionsCountFromTxs = (where: string) => {
  return gql`
    query QueryTransactionsCountFromTxs {
      transactions_aggregate(
        where: ${where}
      ) {
        aggregate {
          count
        }
      }
    }`;
};

// Handle the case where contract address is searched
export const queryTransactionFromContractTxs = (where: string) => {
  return gql`
    query QueryTransactionFromContractsTxs($pageSize: Int!, $offset: Int!) {
      contract_transactions_view(
        where: ${where},
        limit: $pageSize,
        offset: $offset,
        order_by: { timestamp: desc }
      ) {
        hash
        sender
        is_send
        height
        is_execute
        is_ibc
        is_instantiate
        is_store_code
        is_clear_admin
        is_migrate
        is_update_admin
        messages
        success
        timestamp
      }
    }`;
};

export const queryTransactionCountFromContractTxs = (where: string) => {
  return gql`
    query QueryTransactionCountFromContractsTxs {
      contract_transactions_aggregate(
          where: ${where}
        ) {
          aggregate {
            count
          }
        }
    }`;
};
