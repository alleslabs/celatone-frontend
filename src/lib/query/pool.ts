import { graphql } from "lib/gql";

export const getPoolList = graphql(`
  query getPoolList(
    $expression: pools_bool_exp
    $offset: Int!
    $pageSize: Int!
  ) {
    pools(
      where: $expression
      order_by: { id: asc }
      offset: $offset
      limit: $pageSize
    ) {
      id
      type
      is_superfluid
      liquidity
    }
  }
`);

export const getPoolListCount = graphql(`
  query getPoolListCount($expression: pools_bool_exp) {
    pools_aggregate(where: $expression) {
      aggregate {
        count
      }
    }
  }
`);

export const getPoolByPoolId = graphql(`
  query getPoolByPoolId($poolId: Int!) {
    pools_by_pk(id: $poolId) {
      id
      type
      is_superfluid
      is_supported
      liquidity
      transaction {
        block_height
      }
      account {
        address
      }
      address
      swap_fee
      exit_fee
      future_pool_governor
      weight
      smooth_weight_change_params
      scaling_factors
      scaling_factor_controller
    }
  }
`);
