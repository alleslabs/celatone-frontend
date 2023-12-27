import { gql } from "graphql-request";

export const getNFTToken = gql`
  query getNFTToken($collectionAddress: String!, $nftAddress: String!) {
    nfts(
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $collectionAddress } }
        }
        vm_address: { vm_address: { _eq: $nftAddress } }
      }
    ) {
      token_id
      uri
      description
      vmAddressByOwner {
        vm_address
      }
    }
  }
`;

export const getNFTTMintInfo = gql`
  query getNFTTMintInfo($nftAddress: String!) {
    nft_transactions(
      where: {
        is_nft_mint: { _eq: true }
        nft: { vm_address: { vm_address: { _eq: $nftAddress } } }
      }
      offset: 0
      limit: 1
    ) {
      transaction {
        hash
        block {
          timestamp
          height
        }
      }
    }
  }
`;

export const getNFTTokenListPagination = gql`
  query getNFTTokenListPagination(
    $limit: Int!
    $offset: Int!
    $collectionAddress: String!
    $search: String
  ) {
    nfts(
      limit: $limit
      offset: $offset
      order_by: { token_id: asc }
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $collectionAddress } }
        }
        _and: { token_id: { _like: $search } }
      }
    ) {
      token_id
      uri
      description
      vmAddressByOwner {
        vm_address
      }
      vm_address {
        vm_address
      }
      collectionByCollection {
        vm_address {
          vm_address
        }
      }
    }
  }
`;

export const getNFTTransactionsCount = gql`
  query getNFTTransactionsCount($nftAddress: String!) {
    nft_transactions_aggregate(
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getNFTTransactionPagination = gql`
  query getNFTTransactionPagination(
    $limit: Int!
    $offset: Int!
    $nftAddress: String!
    $search: String
  ) {
    nft_transactions(
      offset: $offset
      limit: $limit
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
      order_by: { block_height: desc }
    ) {
      transaction {
        hash
        block {
          timestamp
          height
        }
        is_nft_burn
        is_nft_mint
        is_nft_transfer
      }
    }
  }
`;

export const getNFTMutateEventsPagination = gql`
  query getNFTMutateEventsPagination(
    $limit: Int!
    $offset: Int!
    $nftAddress: String!
  ) {
    nft_mutation_events(
      limit: $limit
      offset: $offset
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
      order_by: { block_height: desc }
    ) {
      old_value
      remark
      mutated_field_name
      new_value
      block {
        timestamp
      }
    }
  }
`;

export const getNFTMutateEventsCount = gql`
  query getNFTMutateEventsCount($nftAddress: String!) {
    nft_mutation_events_aggregate(
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getNFTTokenListByAddressPagination = gql`
  query getNFTTokenListByAddressPagination(
    $hexAddress: String!
    $pageSize: Int!
    $offset: Int!
    $search: String
  ) {
    nfts(
      where: {
        vmAddressByOwner: { vm_address: { _eq: $hexAddress } }
        _and: { token_id: { _iregex: $search } }
      }
      order_by: { token_id: asc }
      offset: $offset
      limit: $pageSize
    ) {
      token_id
      uri
      collectionByCollection {
        vm_address {
          vm_address
        }
      }
      vmAddressByOwner {
        vm_address
      }
      vm_address {
        vm_address
      }
    }
  }
`;

export const getNFTTokenCountByAddress = gql`
  query getNFTTokenCountByAddress($hexAddress: String!) {
    nfts_aggregate(
      where: { vmAddressByOwner: { vm_address: { _eq: $hexAddress } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getUserNFTListByCollectionPagination = gql`
  query getUserNFTListByCollectionPagination(
    $collectionAddress: String!
    $hexAddress: String!
    $pageSize: Int!
    $offset: Int!
    $search: String
  ) {
    nfts(
      limit: $pageSize
      offset: $offset
      order_by: { token_id: asc }
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $collectionAddress } }
        }
        vmAddressByOwner: { vm_address: { _eq: $hexAddress } }
        _and: { token_id: { _iregex: $search } }
      }
    ) {
      token_id
      uri
      description
      vmAddressByOwner {
        vm_address
      }
      vm_address {
        vm_address
      }
    }
  }
`;
