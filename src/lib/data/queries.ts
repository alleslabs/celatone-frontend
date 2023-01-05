import { graphql } from "lib/gql";

export const getCodeListByUserQueryDocument = graphql(`
  query getCodeListByUserQuery($walletAddr: String!) {
    codes(
      where: { account: { address: { _eq: $walletAddr } } }
      limit: 500
      offset: 0
      order_by: { id: desc }
    ) {
      id
      instantiated: contract_instantiated
      account {
        uploader: address
      }
    }
  }
`);

export const getCodeListByIDsQueryDocument = graphql(`
  query getCodeListByIDsQuery($ids: [Int!]!) {
    codes(where: { id: { _in: $ids } }) {
      id
      instantiated: contract_instantiated
      account {
        uploader: address
      }
    }
  }
`);

export const getInstantiatedCountByUserQueryDocument = graphql(`
  query getInstantiatedCountByUserQueryDocument($walletAddr: String!) {
    contracts_aggregate(
      where: { transaction: { account: { address: { _eq: $walletAddr } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);

export const getInstantiatedListByUserQueryDocument = graphql(`
  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {
    contracts(
      where: { transaction: { account: { address: { _eq: $walletAddr } } } }
      limit: 500
      offset: 0
      order_by: { transaction: { block: { timestamp: desc } } }
    ) {
      label
      address
      transaction {
        block {
          timestamp
        }
      }
    }
  }
`);

export const getInstantiateDetailByContractQueryDocument = graphql(`
  query getInstantiateDetailByContractQueryDocument($contractAddress: String!) {
    contracts_by_pk(address: $contractAddress) {
      init_msg
      transaction {
        hash
      }
    }
  }
`);

export const getExecuteTransactionsFromContractAddress = graphql(`
  query getExecuteTransactionsFromContractAddress(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_transactions(
      where: {
        contract: { address: { _eq: $contractAddress } }
        transaction: { is_execute: { _eq: true } }
      }
      order_by: { transaction: { block_height: asc } }
      limit: $pageSize
      offset: $offset
    ) {
      transaction {
        hash
        messages
        success
        account {
          address
        }
        block {
          height
          timestamp
        }
      }
    }
  }
`);

export const getExecuteTransactionsCountFromContractAddress = graphql(`
  query getExecuteTransactionsCountFromContractAddress(
    $contractAddress: String!
  ) {
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
