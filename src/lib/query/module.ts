import { gql } from "graphql-request";

export const getModuleIdByNameAndVmAddressQueryDocument = gql`
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
`;

export const getModuleHistoriesQueryDocumentOld = gql`
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
`;

export const getModuleHistoriesQueryDocument = gql`
  query getModuleHistoriesQuery(
    $moduleId: String!
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
`;

export const getModuleHistoriesCountQueryDocumentOld = gql`
  query getModuleHistoriesCountQuery($moduleId: Int!) {
    module_histories_aggregate(where: { module_id: { _eq: $moduleId } }) {
      aggregate {
        count
      }
    }
  }
`;

export const getModuleHistoriesCountQueryDocument = gql`
  query getModuleHistoriesCountQuery($moduleId: String!) {
    module_histories_aggregate(where: { module_id: { _eq: $moduleId } }) {
      aggregate {
        count
      }
    }
  }
`;

export const getModuleInitialPublishInfoQueryDocumentOld = gql`
  query getModuleInitialPublishInfoQuery($moduleId: Int!, $isGov: Boolean!) {
    modules(where: { id: { _eq: $moduleId } }) {
      publisher_vm_address: vm_address {
        vm_address
      }
      publish_transaction: transaction {
        hash
      }
      module_proposals(
        where: {
          proposal: { type: { _in: ["/initia.move.v1.MsgGovPublish"] } }
        }
        order_by: { proposal_id: asc }
        limit: 1
      ) @include(if: $isGov) {
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
`;

export const getModuleInitialPublishInfoQueryDocument = gql`
  query getModuleInitialPublishInfoQuery($moduleId: String!, $isGov: Boolean!) {
    modules(where: { id: { _eq: $moduleId } }) {
      publisher_vm_address: vm_address {
        vm_address
      }
      publish_transaction: transaction {
        hash
      }
      module_proposals(
        where: {
          proposal: { type: { _in: ["/initia.move.v1.MsgGovPublish"] } }
        }
        order_by: { proposal_id: asc }
        limit: 1
      ) @include(if: $isGov) {
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
`;
