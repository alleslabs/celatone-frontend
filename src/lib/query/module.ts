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
