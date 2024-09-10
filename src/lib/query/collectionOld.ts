import { gql } from "graphql-request";

export const getCollectionTotalBurnedCountQueryOld = gql`
  query getCollectionTotalBurnedCountQueryOld($vmAddress: String!) {
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

export const getCollectionMutateEventsCountQueryOld = gql`
  query getCollectionMutateEventsCountQueryOld($vmAddress: String!) {
    collection_mutation_events_aggregate(
      where: { collection: { vm_address: { vm_address: { _eq: $vmAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionUniqueHoldersCountQueryOld = gql`
  query getCollectionUniqueHoldersCountQueryOld($vmAddress: String!) {
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

export const getCollectionMutateEventsQueryOld = gql`
  query getCollectionMutateEventsQueryOld(
    $collectionAddress: String!
    $offset: Int!
    $limit: Int!
  ) {
    collection_mutation_events(
      limit: $limit
      offset: $offset
      where: {
        collection: { vm_address: { vm_address: { _eq: $collectionAddress } } }
      }
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

export const getCollectionsByAccountQueryOld = gql`
  query getCollectionsByAccountQueryOld($accountAddress: String!) {
    collections(
      where: {
        nfts: { vmAddressByOwner: { vm_address: { _eq: $accountAddress } } }
      }
      order_by: { name: asc }
    ) {
      name
      uri
      vm_address {
        vm_address
      }
      nfts_aggregate(
        where: {
          vmAddressByOwner: { vm_address: { _eq: $accountAddress } }
          is_burned: { _eq: false }
        }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;
