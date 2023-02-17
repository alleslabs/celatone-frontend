import { graphql } from "lib/gql";

export const getBlockTimestampByHeightQueryDocument = graphql(`
  query getBlockTimestampByHeightQuery($height: Int!) {
    blocks_by_pk(height: $height) {
      timestamp
    }
  }
`);
