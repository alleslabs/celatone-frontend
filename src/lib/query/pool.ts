import { graphql } from "lib/gql";

export const getPoolList = graphql(`
  query getPoolList(
    $expression: pools_bool_exp
    $order: order_by
    $offset: Int!
    $pageSize: Int!
  ) {
    pools(
      where: $expression
      order_by: { id: $order }
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

export const getPoolListByDenoms = graphql(`
  query getPoolListByDenoms(
    $denoms: _varchar
    $expression: pools_bool_exp
    $order: order_by
    $offset: Int!
    $pageSize: Int!
  ) {
    pools: search_pools_with_denoms(
      args: { denoms: $denoms }
      where: $expression
      order_by: { id: $order }
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

export const getPoolListByDenomsCount = graphql(`
  query getPoolListByDenomsCount(
    $denoms: _varchar
    $expression: pools_bool_exp
  ) {
    pools_aggregate: search_pools_with_denoms_aggregate(
      args: { denoms: $denoms }
      where: $expression
    ) {
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

export const getPoolsByPoolIds = graphql(`
  query getPoolsByPoolIds($poolIds: [Int!]!) {
    pools(where: { id: { _in: $poolIds } }) {
      id
      liquidity
    }
  }
`);
