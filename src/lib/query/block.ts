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

export const getBlockCountQueryDocument = graphql(`
  query getBlockCountQuery {
    blocks(limit: 1, order_by: { height: desc }) {
      height
    }
  }
`);
