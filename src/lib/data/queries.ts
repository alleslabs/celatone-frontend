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
      access_config_permission
      access_config_addresses
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
      access_config_permission
      access_config_addresses
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

export const getExecuteTxsByContractAddress = graphql(`
  query getExecuteTxsByContractAddress(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_transactions(
      where: {
        contract: { address: { _eq: $contractAddress } }
        transaction: { is_execute: { _eq: true } }
      }
      order_by: { transaction: { block: { timestamp: desc } } }
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

export const getRelatedProposalsByContractAddress = graphql(`
  query getRelatedProposalsByContractAddress(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_proposals(
      where: { contract: { address: { _eq: $contractAddress } } }
      order_by: { proposal_id: desc }
      offset: $offset
      limit: $pageSize
    ) {
      proposal {
        title
        status
        voting_end_time
        deposit_end_time
        type
        account {
          address
        }
      }
      proposal_id
      resolved_height
    }
  }
`);

export const getRelatedProposalsCountByContractAddress = graphql(`
  query getRelatedProposalsCountByContractAddress($contractAddress: String!) {
    contract_proposals_aggregate(
      where: { contract: { address: { _eq: $contractAddress } } }
    ) {
      aggregate {
        count
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

export const getContractListCountByCodeId = graphql(`
  query getContractListCountByCodeId($codeId: Int!) {
    contracts_aggregate(where: { code_id: { _eq: $codeId } }) {
      aggregate {
        count
      }
    }
  }
`);

export const getCodeInfoByCodeId = graphql(`
  query getCodeInfoByCodeId($codeId: Int!) {
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
      code_proposals {
        proposal_id
        block {
          height
          timestamp
        }
      }
      access_config_permission
      access_config_addresses
    }
  }
`);
