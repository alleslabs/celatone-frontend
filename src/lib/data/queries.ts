import { graphql } from "lib/gql";

export const getBlockTimestampByHeightQueryDocument = graphql(`
  query getBlockTimestampByHeightQuery($height: Int!) {
    blocks_by_pk(height: $height) {
      timestamp
    }
  }
`);

export const getCodeListQueryDocument = graphql(`
  query getCodeListQuery {
    codes(limit: 500, offset: 0, order_by: { id: desc }) {
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
    }
  }
`);

export const getCodeListByUserQueryDocument = graphql(`
  query getCodeListByUserQuery($walletAddr: String!) {
    codes(
      where: { account: { address: { _eq: $walletAddr } } }
      limit: 500
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
            type: { _in: ["InstantiateContract", "InstantiateContract2"] }
          }
        }
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
    $contractAddresses: [String!]
  ) {
    contracts(where: { address: { _in: $contractAddresses } }) {
      address
      account {
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
      account {
        address
      }
      transaction {
        block {
          timestamp
        }
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

export const getTxsByContractAddress = graphql(`
  query getTxsByContractAddress(
    $contractAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    contract_transactions(
      where: { contract: { address: { _eq: $contractAddress } } }
      order_by: { transaction: { block: { timestamp: desc } } }
      offset: $offset
      limit: $pageSize
    ) {
      transaction {
        hash
        success
        messages
        account {
          address
        }
        block {
          height
          timestamp
        }
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
