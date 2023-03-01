import { graphql } from "lib/gql";

export const getExecuteTxsByContractAddressPagination = graphql(`
  query getExecuteTxsByContractAddressPagination(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_transactions_view(
      where: {
        contract_address: { _eq: $contractAddress }
        is_execute: { _eq: true }
      }
      order_by: { timestamp: desc }
      limit: $pageSize
      offset: $offset
    ) {
      hash
      messages
      success
      sender
      height
      timestamp
      is_execute
      is_ibc
      is_instantiate
      is_send
      is_store_code
      is_migrate
      is_update_admin
      is_clear_admin
    }
  }
`);

export const getExecuteTxsCountByContractAddress = graphql(`
  query getExecuteTxsCountByContractAddress($contractAddress: String!) {
    contract_transactions_aggregate(
      where: {
        contract: { address: { _eq: $contractAddress } }
        transaction: { is_execute: { _eq: true } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`);

export const getTxsByContractAddressPagination = graphql(`
  query getTxsByContractAddress(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_transactions_view(
      where: { contract_address: { _eq: $contractAddress } }
      order_by: { timestamp: desc }
      offset: $offset
      limit: $pageSize
    ) {
      hash
      success
      messages
      sender
      height
      timestamp
      is_execute
      is_ibc
      is_instantiate
      is_send
      is_store_code
      is_migrate
      is_update_admin
      is_clear_admin
    }
  }
`);

export const getTxsCountByContractAddress = graphql(`
  query getTxsCountByContractAddress($contractAddress: String!) {
    contract_transactions_aggregate(
      where: { contract: { address: { _eq: $contractAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);
