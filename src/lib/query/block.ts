import { graphql } from "lib/gql";

export const getLatestBlockInfoQueryDocument = graphql(`
  query getLatestBlockInfo {
    blocks(limit: 1, order_by: { height: desc }) {
      height
      timestamp
    }
  }
`);

export const getBlockTimeQueryDocument = graphql(`
  query getBlockTime {
    hundred: blocks(order_by: { height: desc }, offset: 100, limit: 1) {
      height
      timestamp
    }
    latest: blocks(order_by: { height: desc }, limit: 1) {
      height
      timestamp
    }
  }
`);
