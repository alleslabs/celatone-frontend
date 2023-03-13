import { graphql } from "lib/gql";

export const getCodeListQueryDocument = graphql(`
  query getCodeListQuery {
    codes(limit: 100, offset: 0, order_by: { id: desc }) {
      id
      contracts_aggregate {
        aggregate {
          count
        }
      }
      account {
        uploader: address
      }
      access_config_permission
      access_config_addresses
      cw2_contract
      cw2_version
    }
  }
`);

export const getCodeListByUserQueryDocument = graphql(`
  query getCodeListByUserQuery($walletAddr: String!) {
    codes(
      where: { account: { address: { _eq: $walletAddr } } }
      limit: 100
      offset: 0
      order_by: { id: desc }
    ) {
      id
      contracts_aggregate {
        aggregate {
          count
        }
      }
      account {
        uploader: address
      }
      access_config_permission
      access_config_addresses
      cw2_contract
      cw2_version
    }
  }
`);

export const getCodeListByIDsQueryDocument = graphql(`
  query getCodeListByIDsQuery($ids: [Int!]!) {
    codes(where: { id: { _in: $ids } }) {
      id
      contracts_aggregate {
        aggregate {
          count
        }
      }
      account {
        uploader: address
      }
      access_config_permission
      access_config_addresses
      cw2_contract
      cw2_version
    }
  }
`);

export const getCodeDataByCodeId = graphql(`
  query getCodeDataByCodeId($codeId: Int!) {
    codes_by_pk(id: $codeId) {
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
      # Can only have 1 store code proposal
      code_proposals(limit: 1) {
        proposal_id
        block {
          height
          timestamp
        }
      }
      access_config_permission
      access_config_addresses
      cw2_contract
      cw2_version
    }
  }
`);

export const getCodeListByWalletAddressPagination = graphql(`
  query getCodeListByWalletAddressPagination(
    $walletAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    codes(
      where: { account: { address: { _eq: $walletAddress } } }
      limit: $pageSize
      offset: $offset
      order_by: { id: desc }
    ) {
      id
      contracts_aggregate {
        aggregate {
          count
        }
      }
      account {
        uploader: address
      }
      access_config_permission
      access_config_addresses
      cw2_contract
      cw2_version
    }
  }
`);

export const getCodeListCountByWalletAddress = graphql(`
  query getCodeListCountByWalletAddress($walletAddress: String!) {
    codes_aggregate(where: { account: { address: { _eq: $walletAddress } } }) {
      aggregate {
        count
      }
    }
  }
`);
