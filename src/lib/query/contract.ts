import { graphql } from "lib/gql";

export const getInstantiatedListByUserQueryDocument = graphql(`
  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {
    contracts(
      where: { accountByInitBy: { address: { _eq: $walletAddr } } }
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
      where: { accountByInitBy: { address: { _eq: $walletAddr } } }
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

export const getContractListByCodeIdPagination = graphql(`
  query getContractListByCodeIdPagination(
    $codeId: Int!
    $offset: Int!
    $pageSize: Int!
  ) {
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

export const getMigrationHistoriesByContractAddressPagination = graphql(`
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
      code {
        account {
          address
        }
      }
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

export const getContractListByWalletAddressPagination = graphql(`
  query getContractListByWalletAddressPagination(
    $walletAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contracts(
      where: { accountByInitBy: { address: { _eq: $walletAddress } } }
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

export const getContractListByAdminPagination = graphql(`
  query getContractListByAdminPagination(
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

export const getContractListCountByAdmin = graphql(`
  query getContractListCountByAdmin($walletAddress: String!) {
    contracts_aggregate(
      where: { account: { address: { _eq: $walletAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);
