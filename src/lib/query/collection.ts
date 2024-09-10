import { gql } from "graphql-request";

export const getCollectionMutateEventsCountQuery = gql`
  query getCollectionMutateEventsCountQuery($vmAddress: String!) {
    collection_mutation_events_aggregate(
      where: { collection_id: { _eq: $vmAddress } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionUniqueHoldersCountQuery = gql`
  query getCollectionUniqueHoldersCountQuery($vmAddress: String!) {
    nfts_aggregate(
      where: { collection: { _eq: $vmAddress } }
      distinct_on: owner
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionMutateEventsQuery = gql`
  query getCollectionMutateEventsQuery(
    $collectionAddress: String!
    $offset: Int!
    $limit: Int!
  ) {
    collection_mutation_events(
      limit: $limit
      offset: $offset
      where: { collection_id: { _eq: $collectionAddress } }
      order_by: { block_height: desc }
    ) {
      mutated_field_name
      new_value
      old_value
      remark
      block {
        timestamp
      }
    }
  }
`;

export const getCollectionsByAccountQuery = gql`
  query getCollectionsByAccountQuery($accountAddress: String!) {
    collections(
      where: { nfts: { owner: { _eq: $accountAddress } } }
      order_by: { name: asc }
    ) {
      name
      uri
      id
      nfts_aggregate(
        where: { owner: { _eq: $accountAddress }, is_burned: { _eq: false } }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;
