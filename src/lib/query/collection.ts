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
      order_by: { name: asc }
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

export const getCollectionActivitiesPagination = gql`
  query getCollectionActivitiesPagination(
    $collectionAddress: String!
    $offset: Int!
    $pageSize: Int!
    $search: String
  ) {
    collection_transactions(
      limit: $pageSize
      offset: $offset
      where: {
        collection: { vm_address: { vm_address: { _eq: $collectionAddress } } }
        _and: { nft: { token_id: { _iregex: $search } } }
      }
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
      nft {
        token_id
      }
      is_collection_create
    }
  }
`;

export const getCollectionMutateEventsPagination = gql`
  query getCollectionMutateEventsPagination(
    $collectionAddress: String!
    $offset: Int!
    $pageSize: Int!
  ) {
    collection_mutation_events(
      limit: $pageSize
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

export const getCollectionListByAddress = gql`
  query getCollectionListByAddress($accountAddress: String!) {
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
        where: { vmAddressByOwner: { vm_address: { _eq: $accountAddress } } }
      ) {
        aggregate {
          count
        }
      }
    }
  }
`;
