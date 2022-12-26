import { gql } from "graphql-request";

// Handle normal case where msg of none 4 main types are included
export const queryShowallFromTxs = (search: string) => {
  const hash = `hash: {_eq: "\\\\x${search}"} `;
  return gql`
        query QueryShowAllFromTxs($userAddr: String = "", $pageSize: Int!, $offset: Int!) {
        transactions(
            where: {
            account: { address: { _eq: $userAddr } },
            ${search !== "" ? `${hash}` : ""},
            _and: {
                _or: [
                { is_execute: { _eq: true } }
                { is_instantiate: { _eq: true } }
                {
                  _and: [
                    { is_ibc: { _eq: true} }
                    {
                      _or: [
                        { is_execute: { _neq: false } }
                        { is_instantiate: { _neq: false } }
                        { is_store_code: { _neq: false } }
                        { is_send: { _neq: false } }
                      ]
                    }
                  ]
                }
                { is_store_code: { _eq: true } }
                { is_send: { _eq: true } }
                ]
            }
            
            }
            limit: $pageSize
            offset: $offset
            order_by: { block_height: desc }
        ) {
            hash
            is_send
            is_execute
            is_ibc
            is_instantiate
            is_store_code
            messages
            success
            block {
            timestamp
            }
        }
        transactions_aggregate(
            where: {
            account: {
                address: { _eq: $userAddr },
                transactions: {
                _and: {
                    _or: [
                    { is_execute: { _eq: true } }
                    { is_instantiate: { _eq: true } }
                    { is_store_code: { _eq: true } }
                    {
                      _and: [
                        { is_ibc: { _eq: true} }
                        {
                          _or: [
                            { is_execute: { _neq: false } }
                            { is_instantiate: { _neq: false } }
                            { is_store_code: { _neq: false } }
                            { is_send: { _neq: false } }
                          ]
                        }
                      ]
                    }
                    { is_send: { _eq: true } }
                    ]
                }
                }
            }
            ${search !== "" ? `${hash}` : ""},
            }
        ) {
            aggregate {
            count
            }
        }
        }
    `;
};

// Handle the case where action buttons are pressed
export const queryWithActionsFromTxs = (
  search: string,
  actionsFilter: string
) => {
  const hash = `hash: {_eq: "\\\\x${search}"} `;
  return gql`
        query QueryWithActionsFromTxs($userAddr: String!, $pageSize: Int!, $offset: Int!) {
        transactions(
            where: { account: { address: { _eq: $userAddr } },
            ${search !== "" ? `${hash}` : ""},
            ${actionsFilter} },
            limit: $pageSize,
            offset: $offset,
            order_by: { block_height: desc }
        ) {
            hash
            is_send
            is_execute
            is_ibc
            is_instantiate
            is_store_code
            messages
            success
            block {
            timestamp
            }
        }
        transactions_aggregate(
            where: {
            account: {
                address: { _eq: $userAddr },
            }
            ${actionsFilter}
            ${search !== "" ? `${hash}` : ""},
            }
        ) {
            aggregate {
            count
            }
        }
        }
    `;
};

// Handle the case where contract address is searched
export const queryAddrFromContracts = (actionsFilter: string) => {
  return gql`
      query QueryAddrFromContracts($userAddr: String!, $contractAddress: String!, $pageSize: Int!, $offset: Int!) {
        contract_transactions(
          where: {
            transaction: { 
              account: { address: { _eq: $userAddr } },
              ${actionsFilter !== "" ? `${actionsFilter},` : ""}
            }
            contract: { address: { _eq: $contractAddress } }
          }
          limit: $pageSize,
          offset: $offset,
          order_by: { transaction: { block_height: desc } }
        ) {
          transaction {
            hash
            is_send
            is_execute
            is_ibc
            is_instantiate
            is_store_code
            messages
            success
            block {
              timestamp
            }
          }
        }
        contract_transactions_aggregate(
          where: {
            transaction: { 
              account: { address: { _eq: $userAddr } },
              ${actionsFilter !== "" ? `${actionsFilter},` : ""}
            }
            contract: { address: { _eq: $contractAddress } }
          }
        ) {
          aggregate {
            count
          }
        }
      }
    `;
};
