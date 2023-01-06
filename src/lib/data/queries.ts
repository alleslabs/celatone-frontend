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

export const getContractListFromCodeId = graphql(`
  query getContractListFromCodeId(
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
      transaction {
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

export const getContractListCountFromCodeId = graphql(`
  query getContractListCountFromCodeId($codeId: Int!) {
    contracts_aggregate(where: { code_id: { _eq: $codeId } }) {
      aggregate {
        count
      }
    }
  }
`);

export const getCodeInfoFromCodeId = graphql(`
  query getCodeInfoFromCodeId($codeId: Int!) {
    codes(where: { id: { _eq: $codeId } }) {
      id
      account {
        address
      }
      transaction {
        hash
        block {
          height
          timestamp
        }
      }
      code_proposals {
        proposal_id
      }
      access_config_permission
      access_config_addresses
    }
  }
`);
