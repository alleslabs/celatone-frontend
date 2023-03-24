import { graphql } from "lib/gql";

export const getRelatedProposalsByContractAddressPagination = graphql(`
  query getRelatedProposalsByContractAddressPagination(
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
        voting_time
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
      voting_time
      voting_end_time
      deposit_end_time
      type
      id
      contract_proposals {
        resolved_height
      }
      code_proposals {
        resolved_height
      }
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
      voting_time
      deposit_end_time
      resolved_height
      status
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
