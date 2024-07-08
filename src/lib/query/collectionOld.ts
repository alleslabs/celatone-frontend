import { gql } from "graphql-request";

export const getCollectionsQueryOld = gql`
  query getCollectionsQueryOld(
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
      vm_address {
        vm_address
      }
      vmAddressByCreator {
        vm_address
      }
    }
    collections_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`;

export const getCollectionByCollectionAddressQueryOld = gql`
  query getCollectionByCollectionAddressQueryOld($vmAddress: String!) {
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

export const getCollectionCreatorQueryOld = gql`
  query getCollectionCreatorQueryOld($vmAddress: String!) {
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

export const getCollectionActivitiesCountQueryOld = gql`
  query getCollectionActivitiesCountQueryOld($vmAddress: String!) {
    collection_transactions_aggregate(
      where: { collection: { vm_address: { vm_address: { _eq: $vmAddress } } } }
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

export const getCollectionActivitiesQueryOld = gql`
  query getCollectionActivitiesQueryOld(
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
      nft {
        token_id
        vm_address {
          vm_address
        }
      }
      is_collection_create
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
