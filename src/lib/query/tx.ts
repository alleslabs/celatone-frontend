import { graphql } from "lib/gql";

export const getTxsByAddressPagination = graphql(`
  query getTxsByAddressPagination(
    $expression: account_transactions_bool_exp
    $offset: Int!
    $pageSize: Int!
  ) {
    account_transactions(
      where: $expression
      order_by: { block_height: desc }
      offset: $offset
      limit: $pageSize
    ) {
      block {
        height
        timestamp
      }
      transaction {
        account {
          address
        }
        hash
        success
        messages
        is_clear_admin
        is_execute
        is_ibc
        is_instantiate
        is_migrate
        is_send
        is_store_code
        is_update_admin
      }
      is_signer
    }
  }
`);

export const getTxsCountByAddress = graphql(`
  query getTxsCountByAddress($expression: account_transactions_bool_exp) {
    account_transactions_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`);

export const getTxsByPoolIdPagination = graphql(`
  query getTxsByPoolIdPagination(
    $expression: pool_transactions_bool_exp
    $offset: Int!
    $pageSize: Int!
  ) {
    pool_transactions(
      where: $expression
      order_by: { block_height: desc, transaction_id: desc }
      offset: $offset
      limit: $pageSize
    ) {
      block {
        height
        timestamp
      }
      transaction {
        account {
          address
        }
        hash
        success
        messages
        is_ibc
      }
    }
  }
`);

export const getTxsCountByPoolId = graphql(`
  query getTxsCountByPoolId($expression: pool_transactions_bool_exp) {
    pool_transactions_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`);

export const getTxs = graphql(`
  query getTxs($offset: Int!, $pageSize: Int!) {
    transactions(
      order_by: { block_height: desc }
      offset: $offset
      limit: $pageSize
    ) {
      block {
        height
        timestamp
      }
      account {
        address
      }
      hash
      success
      messages
      is_clear_admin
      is_execute
      is_ibc
      is_instantiate
      is_migrate
      is_send
      is_store_code
      is_update_admin
    }
  }
`);

export const getTxsCount = graphql(`
  query getTxsCount {
    transactions(limit: 1, order_by: { id: desc }) {
      id
    }
  }
`);

export const getBlockTransactionsByHeightQueryDocument = graphql(`
  query getBlockTransactionsByHeightQuery(
    $limit: Int!
    $offset: Int!
    $height: Int!
  ) {
    transactions(
      limit: $limit
      offset: $offset
      where: { block_height: { _eq: $height } }
      order_by: { id: asc }
    ) {
      block {
        height
        timestamp
      }
      account {
        address
      }
      hash
      success
      messages
      is_clear_admin
      is_execute
      is_ibc
      is_instantiate
      is_migrate
      is_send
      is_store_code
      is_update_admin
    }
  }
`);

export const getBlockTransactionCountByHeightQueryDocument = graphql(`
  query getBlockTransactionCountByHeightQuery($height: Int!) {
    transactions_aggregate(where: { block_height: { _eq: $height } }) {
      aggregate {
        count
      }
    }
  }
`);

export const getModuleTransactionsQueryDocument = graphql(`
  query getModuleTransactionsQuery(
    $filterExp: module_transactions_bool_exp
    $pageSize: Int!
    $offset: Int!
  ) {
    module_transactions(
      where: $filterExp
      limit: $pageSize
      offset: $offset
      order_by: { block_height: desc }
    ) {
      block {
        height
        timestamp
      }
      transaction {
        account {
          address
        }
        hash
        success
        messages
        is_clear_admin
        is_execute
        is_ibc
        is_instantiate
        is_migrate
        is_send
        is_store_code
        is_update_admin
        is_move_execute
        is_move_execute_event
        is_move_publish
        is_move_script
        is_move_upgrade
      }
    }
  }
`);

export const getModuleTransactionsCountByTypeQueryDocument = graphql(`
  query getModuleTransactionsCountByTypeQuery(
    $moduleId: Int!
    $isUpgrade: Boolean!
  ) {
    module_transactions_aggregate(
      where: {
        module_id: { _eq: $moduleId }
        transaction: { is_move_upgrade: { _eq: $isUpgrade } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`);
