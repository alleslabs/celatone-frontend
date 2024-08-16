import { graphql } from "lib/gql";

export const getContractByContractAddressQueryDocument = graphql(`
  query getContractByContractAddressQueryDocument($contractAddress: String!) {
    contracts_by_pk(address: $contractAddress) {
      address
      code_id
      label
      accountByInitBy {
        address
      }
      admin: account {
        address
      }
    }
  }
`);

export const getInstantiatedListByUserQueryDocument = graphql(`
  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {
    contracts(
      where: { accountByInitBy: { address: { _eq: $walletAddr } } }
      limit: 100
      offset: 0
      order_by: { transaction: { block: { timestamp: desc } } }
    ) {
      label
      address
      accountByInitBy {
        address
      }
    }
  }
`);

export const getInstantiatedCountByUserQueryDocument = graphql(`
  query getInstantiatedCountByUserQueryDocument($walletAddr: String!) {
    contracts_aggregate(
      where: { accountByInitBy: { address: { _eq: $walletAddr } } }
    ) {
      aggregate {
        count
      }
    }
  }
`);
