import { gql } from "graphql-request";

export const getNftQueryOld = gql`
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

export const getNftsQueryOld = gql`
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

export const getNftTransactionsCountQueryOld = gql`
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

export const getNftTransactionsQueryOld = gql`
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

export const getNftMutateEventsQueryOld = gql`
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

export const getNftMutateEventsCountQueryOld = gql`
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

export const getNftsByAccountQueryOld = gql`
  query getNftsByAccountQuery(
    $accountAddress: String!
    $pageSize: Int!
    $offset: Int!
    $expression: nfts_bool_exp!
  ) {
    nfts(
      limit: $pageSize
      offset: $offset
      order_by: { token_id: asc }
      where: $expression
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
    nfts_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`;

export const getNftsCountByAccountQueryOld = gql`
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
