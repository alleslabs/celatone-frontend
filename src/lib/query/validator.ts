import { graphql } from "lib/gql";

export const getValidators = graphql(`
  query getValidators {
    validators {
      commission_max_change
      commission_max_rate
      commission_rate
      consensus_address
      details
      identity
      jailed
      min_self_delegation
      moniker
      operator_address
      website
    }
  }
`);
