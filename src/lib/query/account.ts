import { graphql } from "lib/gql";

export const getAccountTypeByAddressQueryDocument = graphql(`
  query getAccountTypeByAddressQueryDocument($address: String!) {
    accounts_by_pk(address: $address) {
      type
    }
  }
`);
