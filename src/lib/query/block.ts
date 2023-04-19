import { graphql } from "lib/gql";

export const getBlockTimestampByHeightQueryDocument = graphql(`
  query getBlockTimestampByHeightQuery($height: Int!) {
    blocks_by_pk(height: $height) {
      timestamp
    }
  }
`);

export const getBlockListQueryDocument = graphql(`
  query getBlockListQuery($limit: Int!, $offset: Int!) {
    blocks(limit: $limit, offset: $offset, order_by: { height: desc }) {
      hash
      height
      timestamp
      transactions_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`);

export const getBlockDetailsByHeightQueryDocument = graphql(`
  query getBlockDetailsByHeight($height: Int!) {
    blocks_by_pk(height: $height) {
      hash
      height
      timestamp
      transactions_aggregate {
        aggregate {
          sum {
            gas_used
            gas_limit
          }
        }
      }
    }
  }
`);

export const getLatestBlockInfoQueryDocument = graphql(`
  query getLatestBlockInfo {
    blocks(limit: 1, order_by: { height: desc }) {
      height
      timestamp
    }
  }
`);
