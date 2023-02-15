import { graphql } from "lib/gql";

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

export const getProposalsByUserAddress = graphql(`
  query getProposalsByUserAddress(
    $walletAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    proposals(
      where: { account: { address: { _eq: $walletAddress } } }
      offset: $offset
      limit: $pageSize
    ) {
      title
      status
      voting_end_time
      deposit_end_time
      type
      id
    }
  }
`);

export const getProposalsCountByUserAddress = graphql(`
  query getProposalsCountByUserAddress($walletAddress: String!) {
    proposals_aggregate(
      where: { account: { address: { _eq: $walletAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);
