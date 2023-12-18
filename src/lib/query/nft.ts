import { gql } from "graphql-request";

export const getCollectionsPagination = gql`
  query getCollectionsPagination(
    $offset: Int!
    $pageSize: Int!
    $search: String
  ) {
    collections(
      limit: $pageSize
      offset: $offset
      where: { name: { _iregex: $search } }
    ) {
      name
      uri
      description
      vm_address {
        vm_address
      }
    }
  }
`;

export const getCollectionByCollectionAddress = gql`
  query getCollectionByCollectionAddress($vmAddress: String!) {
    collections(where: { vm_address: { vm_address: { _eq: $vmAddress } } }) {
      name
      uri
      description
      nfts(limit: 6, offset: 0) {
        token_id
        uri
      }
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

export const getCollectionTotalBurnedCount = gql`
  query getCollectionByCollectionAddress($vmAddress: String!) {
    nfts_aggregate(
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $vmAddress } }
        }
        is_burned: { _eq: true }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionCreator = gql`
  query getCollectionCreator($vmAddress: String!) {
    collections(where: { vm_address: { vm_address: { _eq: $vmAddress } } }) {
      vmAddressByCreator {
        vm_address
      }
      collection_transactions(
        order_by: { block_height: asc }
        where: { is_collection_create: { _eq: true } }
      ) {
        transaction {
          hash
          block {
            height
            timestamp
          }
        }
      }
    }
  }
`;

export const getCollectionActivitiesCount = gql`
  query getCollectionActivitiesCount($vmAddress: String!) {
    collection_transactions_aggregate(
      where: { collection: { vm_address: { vm_address: { _eq: $vmAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionMutateEventsCount = gql`
  query getCollectionMutateEventsCount($vmAddress: String!) {
    collection_mutation_events_aggregate(
      where: { collection: { vm_address: { vm_address: { _eq: $vmAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectioUniqueHoldersCount = gql`
  query getCollectioUniqueHoldersCount($vmAddress: String!) {
    nfts_aggregate(
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $vmAddress } }
        }
      }
      distinct_on: owner
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionNFTSupllies = gql`
  query getCollectionNFTSupllies(
    $vmAddress: String!
    $offset: Int!
    $pageSize: Int!
    $search: String
  ) {
    nfts(
      limit: $pageSize
      offset: $offset
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $vmAddress } }
        }
        _and: { token_id: { _like: $search } }
      }
    ) {
      token_id
      uri
    }
  }
`;

export const getCollectionActivities = gql`
  query getCollectionActivities(
    $vmAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    collection_transactions(
      limit: $pageSize
      offset: $offset
      where: { collection: { vm_address: { vm_address: { _eq: $vmAddress } } } }
    ) {
      transaction {
        hash
        block {
          timestamp
        }
        messages
      }
    }
  }
`;
