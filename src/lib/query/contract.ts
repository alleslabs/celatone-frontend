import { graphql } from "lib/gql";

export const getContractByContractAddressQueryDocument = graphql(`
  query getContractByContractAddressQueryDocument($contractAddress: String!) {
    contracts_by_pk(address: $contractAddress) {
      address
      code_id
      label
      accountByInitBy {
        address
      }
      admin: account {
        address
      }
    }
  }
`);

export const getContractListQueryDocument = graphql(`
  query getContractListQuery {
    contracts(limit: 100, offset: 0, order_by: { id: desc }) {
      address
      label
      admin: account {
        address
      }
      init_by: contract_histories(
        order_by: { block: { timestamp: asc } }
        limit: 1
      ) {
        block {
          timestamp
        }
        account {
          address
        }
      }
    }
  }
`);

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
