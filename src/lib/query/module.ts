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

export const getModuleDetailsQueryDocument = graphql(`
  query getModuleDetailsQuery($moduleId: Int!) {
    modules(where: { id: { _eq: $moduleId } }) {
      publisher_vm_address: vm_address {
        vm_address
      }
      publish_transaction: transaction {
        hash
      }
      module_proposals(
        where: {
          proposal: {
            type: {
              _in: [
                "/initia.move.v1.MsgGovPublish"
                "/initia.move.v1.MsgGovExecute"
                "/initia.move.v1.MsgGovScript"
              ]
            }
          }
        }
      ) {
        proposal {
          id
          title
        }
      }
      module_histories(order_by: { block: { timestamp: asc } }, limit: 1) {
        block {
          height
          timestamp
        }
      }
    }
  }
`);
