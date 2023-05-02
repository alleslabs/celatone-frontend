import { graphql } from "lib/gql";

export const getAccountIdByAddressQueryDocument = graphql(`
  query getAccountIdByAddressQueryDocument($address: String!) {
    accounts_by_pk(address: $address) {
      id
    }
  }
`);
