import { graphql } from "lib/gql";

export const getInstantiatedListByUserQueryDocument = graphql(`
  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {
    contracts(
      where: {
        accountByInitBy: { address: { _eq: $walletAddr } }
        _or: { transaction: { account: { address: { _eq: $walletAddr } } } }
      }
      limit: 100
      offset: 0
      order_by: { transaction: { block: { timestamp: desc } } }
    ) {
      label
      address
      accountByInitBy {
        address
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

export const getInstantiateDetailByContractQueryDocument = graphql(`
  query getInstantiateDetailByContractQueryDocument($contractAddress: String!) {
    contracts_by_pk(address: $contractAddress) {
      init_msg
      transaction {
        hash
      }
      contract_proposals(
        where: {
          proposal: {
            type: {
              _in: [
                "InstantiateContract"
                "InstantiateContract2"
                "SoftwareUpgrade"
              ]
            }
          }
        }
        order_by: { proposal: { id: asc } }
        limit: 1
      ) {
        proposal {
          id
          title
        }
      }
    }
  }
`);

export const getAdminByContractAddressesQueryDocument = graphql(`
  query getAdminByContractAddressesQueryDocument(
    $contractAddresses: [String!]!
  ) {
    contracts(where: { address: { _in: $contractAddresses } }) {
      address
      admin: account {
        address
      }
    }
  }
`);

export const getExecuteTxsByContractAddress = graphql(`
  query getExecuteTxsByContractAddress(
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

export const getContractListByAdmin = graphql(`
  query getContractListByAdmin($address: String!) {
    contracts(
      where: { account: { address: { _eq: $address } } }
      order_by: { transaction: { block: { timestamp: desc } } }
    ) {
      address
      label
      accountByInitBy {
        address
      }
    }
  }
`);

export const getContractListByCodeId = graphql(`
  query getContractListByCodeId($codeId: Int!, $offset: Int!, $pageSize: Int!) {
    contracts(
      where: { code_id: { _eq: $codeId } }
      order_by: { transaction: { block: { timestamp: desc } } }
      offset: $offset
      limit: $pageSize
    ) {
      address
      label
      admin: account {
        address
      }
      init_by: contract_histories(
        order_by: { block: { timestamp: asc } }
        limit: 1
      ) {
        account {
          address
        }
      }
      contract_histories(order_by: { block: { timestamp: desc } }, limit: 1) {
        block {
          timestamp
        }
        account {
          address
        }
        remark
      }
    }
  }
`);

export const getContractListCountByCodeId = graphql(`
  query getContractListCountByCodeId($codeId: Int!) {
    contracts_aggregate(where: { code_id: { _eq: $codeId } }) {
      aggregate {
        count
      }
    }
  }
`);

export const getTxsByContractAddress = graphql(`
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

export const getMigrationHistoriesByContractAddress = graphql(`
  query getMigrationHistoriesByContractAddress(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_histories(
      where: { contract: { address: { _eq: $contractAddress } } }
      order_by: { block: { timestamp: desc } }
      limit: $pageSize
      offset: $offset
    ) {
      code_id
      account {
        address
      }
      block {
        height
        timestamp
      }
      remark
    }
  }
`);

export const getMigrationHistoriesCountByContractAddress = graphql(`
  query getMigrationHistoriesCountByContractAddress($contractAddress: String!) {
    contract_histories_aggregate(
      where: { contract: { address: { _eq: $contractAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);

export const getContractListByWalletAddressWithPagination = graphql(`
  query getContractListByWalletAddressWithPagination(
    $walletAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contracts(
      where: {
        accountByInitBy: { address: { _eq: $walletAddress } }
        _or: { transaction: { account: { address: { _eq: $walletAddress } } } }
      }
      limit: $pageSize
      offset: $offset
      order_by: { transaction: { block: { timestamp: desc } } }
    ) {
      address
      label
      admin: account {
        address
      }
      init_by: contract_histories(
        order_by: { block: { timestamp: asc } }
        limit: 1
      ) {
        account {
          address
        }
      }
      contract_histories(order_by: { block: { timestamp: desc } }, limit: 1) {
        block {
          timestamp
        }
        account {
          address
        }
        remark
      }
    }
  }
`);

export const getContractListCountByWalletAddressWithPagination = graphql(`
  query getContractListCountByWalletAddressWithPagination(
    $walletAddress: String!
  ) {
    contracts_aggregate(
      where: {
        accountByInitBy: { address: { _eq: $walletAddress } }
        _or: { transaction: { account: { address: { _eq: $walletAddress } } } }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`);

export const getContractListByAdminWithPagination = graphql(`
  query getContractListByAdminWithPagination(
    $walletAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contracts(
      where: { account: { address: { _eq: $walletAddress } } }
      limit: $pageSize
      offset: $offset
      order_by: { transaction: { block: { timestamp: desc } } }
    ) {
      address
      label
      admin: account {
        address
      }
      init_by: contract_histories(
        order_by: { block: { timestamp: asc } }
        limit: 1
      ) {
        account {
          address
        }
      }
      contract_histories(order_by: { block: { timestamp: desc } }, limit: 1) {
        block {
          timestamp
        }
        account {
          address
        }
        remark
      }
    }
  }
`);

export const getContractListCountByAdminWithPagination = graphql(`
  query getContractListCountByAdminWithPagination($walletAddress: String!) {
    contracts_aggregate(
      where: { account: { address: { _eq: $walletAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);
