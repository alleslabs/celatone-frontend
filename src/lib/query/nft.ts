import { gql } from "graphql-request";

export const getNftQuery = gql`
  query getNftQuery($collectionAddress: String!, $nftAddress: String!) {
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
      is_burned
      vmAddressByOwner {
        vm_address
      }
      collectionByCollection {
        vm_address {
          vm_address
        }
        name
      }
    }
  }
`;

export const getNftMintInfoQuery = gql`
  query getNftMintInfoQuery($nftAddress: String!) {
    nft_transactions(
      where: {
        is_nft_mint: { _eq: true }
        nft: { vm_address: { vm_address: { _eq: $nftAddress } } }
      }
      offset: 0
      limit: 1
    ) {
      transaction {
        account {
          address
        }
        hash
        block {
          timestamp
          height
        }
      }
    }
  }
`;

export const getNftsQuery = gql`
  query getNftsQuery(
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
        is_burned: { _eq: false }
        _or: [
          { token_id: { _iregex: $search } }
          { vm_address: { vm_address: { _eq: $search } } }
        ]
      }
    ) {
      token_id
      uri
      description
      is_burned
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
        name
      }
    }
  }
`;

export const getNftTransactionsCountQuery = gql`
  query getNftTransactionsCountQuery($nftAddress: String!) {
    nft_transactions_aggregate(
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getNftTransactionsQuery = gql`
  query getNftTransactionsQuery(
    $limit: Int!
    $offset: Int!
    $nftAddress: String!
    $search: String
  ) {
    nft_transactions(
      offset: $offset
      limit: $limit
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
      order_by: [
        { block_height: desc }
        { nft: { token_id: desc } }
        { is_nft_burn: desc }
        { is_nft_transfer: desc }
        { is_nft_mint: desc }
      ]
    ) {
      is_nft_burn
      is_nft_mint
      is_nft_transfer
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

export const getNftMutateEventsQuery = gql`
  query getNftMutateEventsQuery(
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

export const getNftMutateEventsCountQuery = gql`
  query getNftMutateEventsCountQuery($nftAddress: String!) {
    nft_mutation_events_aggregate(
      where: { nft: { vm_address: { vm_address: { _eq: $nftAddress } } } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getNftsByAccountQuery = gql`
  query getNftsByAccountQuery(
    $accountAddress: String!
    $pageSize: Int!
    $offset: Int!
    $search: String
  ) {
    nfts(
      limit: $pageSize
      offset: $offset
      order_by: { token_id: asc }
      where: {
        vmAddressByOwner: { vm_address: { _eq: $accountAddress } }
        is_burned: { _eq: false }
        _or: [
          { token_id: { _iregex: $search } }
          { vm_address: { vm_address: { _eq: $search } } }
        ]
      }
    ) {
      token_id
      uri
      is_burned
      collectionByCollection {
        vm_address {
          vm_address
        }
        name
      }
      vmAddressByOwner {
        vm_address
      }
      vm_address {
        vm_address
      }
    }
    nfts_aggregate(
      where: {
        vmAddressByOwner: { vm_address: { _eq: $accountAddress } }
        token_id: { _iregex: $search }
        is_burned: { _eq: false }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const getNftsCountByAccountQuery = gql`
  query getNftsCountByAccountQuery($accountAddress: String!) {
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
`;

export const getAccountNftListByCollectionQuery = gql`
  query getAccountNftListByCollectionQuery(
    $collectionAddress: String!
    $accountAddress: String!
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
        vmAddressByOwner: { vm_address: { _eq: $accountAddress } }
        is_burned: { _eq: false }
        _or: [
          { token_id: { _iregex: $search } }
          { vm_address: { vm_address: { _eq: $search } } }
        ]
      }
    ) {
      token_id
      uri
      description
      is_burned
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
        name
      }
    }
    nfts_aggregate(
      where: {
        collectionByCollection: {
          vm_address: { vm_address: { _eq: $collectionAddress } }
        }
        vmAddressByOwner: { vm_address: { _eq: $accountAddress } }
        token_id: { _iregex: $search }
        is_burned: { _eq: false }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;
