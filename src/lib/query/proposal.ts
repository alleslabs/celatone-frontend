import { graphql } from "lib/gql";

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

export const getProposalsByWalletAddressPagination = graphql(`
  query getProposalsByWalletAddressPagination(
    $walletAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    proposals(
      where: { account: { address: { _eq: $walletAddress } } }
      order_by: { id: desc }
      offset: $offset
      limit: $pageSize
    ) {
      title
      status
      voting_end_time
      deposit_end_time
      type
      id
      is_expedited
      resolved_height
    }
  }
`);

export const getProposalsCountByWalletAddress = graphql(`
  query getProposalsCountByWalletAddress($walletAddress: String!) {
    proposals_aggregate(
      where: { account: { address: { _eq: $walletAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);

export const getRelatedProposalsByModuleIdPagination = graphql(`
  query getRelatedProposalsByModuleIdPagination(
    $moduleId: Int!
    $offset: Int!
    $pageSize: Int!
  ) {
    module_proposals(
      where: { module_id: { _eq: $moduleId } }
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
        is_expedited
        resolved_height
      }
      proposal_id
    }
  }
`);

export const getRelatedProposalsCountByModuleId = graphql(`
  query getRelatedProposalsCountByModuleId($moduleId: Int!) {
    module_proposals_aggregate(where: { module_id: { _eq: $moduleId } }) {
      aggregate {
        count
      }
    }
  }
`);

export const getProposalList = graphql(`
  query getProposalList(
    $expression: proposals_bool_exp
    $offset: Int!
    $pageSize: Int!
  ) {
    proposals(
      where: $expression
      order_by: { id: desc }
      offset: $offset
      limit: $pageSize
    ) {
      type
      id
      title
      voting_end_time
      deposit_end_time
      resolved_height
      status
      is_expedited
      account {
        address
      }
    }
  }
`);

export const getProposalListCount = graphql(`
  query getProposalListCount($expression: proposals_bool_exp) {
    proposals_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`);

export const getProposalTypes = graphql(`
  query getProposalTypes {
    proposals(distinct_on: type) {
      type
    }
  }
`);
