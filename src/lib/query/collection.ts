import { gql } from "graphql-request";

export const getCollectionsQuery = gql`
  query getCollectionsQuery(
    $offset: Int!
    $limit: Int!
    $expression: collections_bool_exp!
  ) {
    collections(
      limit: $limit
      offset: $offset
      where: $expression
      order_by: { name: asc }
    ) {
      name
      uri
      description
      id
      creator
    }
    collections_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionByCollectionAddressQuery = gql`
  query getCollectionByCollectionAddressQuery($vmAddress: String!) {
    collections(where: { id: { _eq: $vmAddress } }) {
      name
      uri
      description
      vmAddressByCreator {
        collectionsByCreator {
          block_height
          name
          vmAddressByCreator {
            vm_address
          }
        }
      }
    }
  }
`;

export const getCollectionCreatorQuery = gql`
  query getCollectionCreatorQuery($vmAddress: String!) {
    collection_transactions(
      where: { collection_id: { _eq: $vmAddress } }
      limit: 1
      order_by: { block_height: asc, transaction: { block_index: asc } }
    ) {
      block {
        height
        timestamp
      }
      transaction {
        hash
      }
      collection {
        creator
      }
    }
  }
`;

export const getCollectionActivitiesCountQuery = gql`
  query getCollectionActivitiesCountQuery($vmAddress: String!) {
    collection_transactions_aggregate(
      where: { collection_id: { _eq: $vmAddress } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

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

export const getCollectionActivitiesQuery = gql`
  query getCollectionActivitiesQuery(
    $expression: collection_transactions_bool_exp
    $offset: Int!
    $limit: Int!
  ) {
    collection_transactions(
      limit: $limit
      offset: $offset
      where: $expression
      order_by: [
        { block_height: desc }
        { nft: { token_id: desc } }
        { is_nft_burn: desc }
        { is_nft_transfer: desc }
        { is_nft_mint: desc }
        { is_collection_create: desc }
      ]
    ) {
      transaction {
        hash
        block {
          timestamp
        }
      }
      is_nft_burn
      is_nft_mint
      is_nft_transfer
      nft_id
      nft {
        token_id
      }
      is_collection_create
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
