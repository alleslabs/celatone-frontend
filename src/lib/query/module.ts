import { graphql } from "lib/gql";

export const getModuleIdByNameAndVmAddressQueryDocument = graphql(`
  query getModuleIdByNameAndVmAddressQuery(
    $name: String!
    $vmAddress: String!
  ) {
    modules(
      where: {
        name: { _eq: $name }
        vm_address: { vm_address: { _eq: $vmAddress } }
      }
    ) {
      id
    }
  }
`);

export const getModuleHistoriesQueryDocument = graphql(`
  query getModuleHistoriesQuery(
    $moduleId: Int!
    $pageSize: Int!
    $offset: Int!
  ) {
    module_histories(
      where: { module_id: { _eq: $moduleId } }
      limit: $pageSize
      offset: $offset
      order_by: { block: { height: desc } }
    ) {
      remark
      block {
        height
        timestamp
      }
      upgrade_policy
    }
  }
`);

export const getModuleHistoriesCountQueryDocument = graphql(`
  query getModuleHistoriesCountQuery($moduleId: Int!) {
    module_histories_aggregate(where: { module_id: { _eq: $moduleId } }) {
      aggregate {
        count
      }
    }
  }
`);
