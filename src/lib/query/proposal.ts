import { gql } from "graphql-request";

export const getRelatedProposalsByModuleIdPagination = gql`
  query getRelatedProposalsByModuleIdPagination(
    $moduleId: String!
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
`;

export const getRelatedProposalsCountByModuleId = gql`
  query getRelatedProposalsCountByModuleId($moduleId: String!) {
    module_proposals_aggregate(where: { module_id: { _eq: $moduleId } }) {
      aggregate {
        count
      }
    }
  }
`;
