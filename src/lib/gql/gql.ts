/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

const documents = {
  "\n  query getCodeListByUserQuery($walletAddr: String!) {\n    codes(\n      where: { account: { address: { _eq: $walletAddr } } }\n      limit: 500\n      offset: 0\n      order_by: { id: desc }\n    ) {\n      id\n      instantiated: contract_instantiated\n      account {\n        uploader: address\n      }\n    }\n  }\n":
    types.GetCodeListByUserQueryDocument,
  "\n  query getCodeListByIDsQuery($ids: [Int!]!) {\n    codes(where: { id: { _in: $ids } }) {\n      id\n      instantiated: contract_instantiated\n      account {\n        uploader: address\n      }\n    }\n  }\n":
    types.GetCodeListByIDsQueryDocument,
  "\n  query getInstantiatedCountByUserQueryDocument($walletAddr: String!) {\n    contracts_aggregate(\n      where: { transaction: { account: { address: { _eq: $walletAddr } } } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n":
    types.GetInstantiatedCountByUserQueryDocumentDocument,
  "\n  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {\n    contracts(\n      where: { transaction: { account: { address: { _eq: $walletAddr } } } }\n      limit: 500\n      offset: 0\n      order_by: { transaction: { block: { timestamp: desc } } }\n    ) {\n      label\n      address\n      transaction {\n        block {\n          timestamp\n        }\n      }\n    }\n  }\n":
    types.GetInstantiatedListByUserQueryDocumentDocument,
  "\n  query getInstantiateDetailByContractQueryDocument($contractAddress: String!) {\n    contracts_by_pk(address: $contractAddress) {\n      init_msg\n      transaction {\n        hash\n      }\n    }\n  }\n":
    types.GetInstantiateDetailByContractQueryDocumentDocument,
  "\n  query getExecuteTransactionsByContractAddress(\n    $contractAddress: String!\n    $offset: Int!\n    $pageSize: Int!\n  ) {\n    contract_transactions(\n      where: {\n        contract: { address: { _eq: $contractAddress } }\n        transaction: { is_execute: { _eq: true } }\n      }\n      order_by: { transaction: { block: { timestamp: desc } } }\n      limit: $pageSize\n      offset: $offset\n    ) {\n      transaction {\n        hash\n        messages\n        success\n        account {\n          address\n        }\n        block {\n          height\n          timestamp\n        }\n      }\n    }\n  }\n":
    types.GetExecuteTransactionsByContractAddressDocument,
  "\n  query getExecuteTransactionsCountByContractAddress(\n    $contractAddress: String!\n  ) {\n    contract_transactions_aggregate(\n      where: {\n        contract: { address: { _eq: $contractAddress } }\n        transaction: { is_execute: { _eq: true } }\n      }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n":
    types.GetExecuteTransactionsCountByContractAddressDocument,
  "\n  query getContractListByCodeId($codeId: Int!, $offset: Int!, $pageSize: Int!) {\n    contracts(\n      where: { code_id: { _eq: $codeId } }\n      order_by: { transaction: { block: { timestamp: desc } } }\n      offset: $offset\n      limit: $pageSize\n    ) {\n      address\n      label\n      transaction {\n        block {\n          timestamp\n        }\n        account {\n          address\n        }\n      }\n    }\n  }\n":
    types.GetContractListByCodeIdDocument,
  "\n  query getContractListCountByCodeId($codeId: Int!) {\n    contracts_aggregate(where: { code_id: { _eq: $codeId } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n":
    types.GetContractListCountByCodeIdDocument,
  "\n  query getCodeInfoByCodeId($codeId: Int!) {\n    codes_by_pk(id: $codeId) {\n      id\n      account {\n        address\n      }\n      transaction {\n        hash\n        block {\n          height\n          timestamp\n        }\n      }\n      code_proposals {\n        proposal_id\n        block {\n          height\n          timestamp\n        }\n      }\n      access_config_permission\n      access_config_addresses\n    }\n  }\n":
    types.GetCodeInfoByCodeIdDocument,
};

export function graphql(
  source: "\n  query getCodeListByUserQuery($walletAddr: String!) {\n    codes(\n      where: { account: { address: { _eq: $walletAddr } } }\n      limit: 500\n      offset: 0\n      order_by: { id: desc }\n    ) {\n      id\n      instantiated: contract_instantiated\n      account {\n        uploader: address\n      }\n    }\n  }\n"
): typeof documents["\n  query getCodeListByUserQuery($walletAddr: String!) {\n    codes(\n      where: { account: { address: { _eq: $walletAddr } } }\n      limit: 500\n      offset: 0\n      order_by: { id: desc }\n    ) {\n      id\n      instantiated: contract_instantiated\n      account {\n        uploader: address\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getCodeListByIDsQuery($ids: [Int!]!) {\n    codes(where: { id: { _in: $ids } }) {\n      id\n      instantiated: contract_instantiated\n      account {\n        uploader: address\n      }\n    }\n  }\n"
): typeof documents["\n  query getCodeListByIDsQuery($ids: [Int!]!) {\n    codes(where: { id: { _in: $ids } }) {\n      id\n      instantiated: contract_instantiated\n      account {\n        uploader: address\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getInstantiatedCountByUserQueryDocument($walletAddr: String!) {\n    contracts_aggregate(\n      where: { transaction: { account: { address: { _eq: $walletAddr } } } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n"
): typeof documents["\n  query getInstantiatedCountByUserQueryDocument($walletAddr: String!) {\n    contracts_aggregate(\n      where: { transaction: { account: { address: { _eq: $walletAddr } } } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {\n    contracts(\n      where: { transaction: { account: { address: { _eq: $walletAddr } } } }\n      limit: 500\n      offset: 0\n      order_by: { transaction: { block: { timestamp: desc } } }\n    ) {\n      label\n      address\n      transaction {\n        block {\n          timestamp\n        }\n      }\n    }\n  }\n"
): typeof documents["\n  query getInstantiatedListByUserQueryDocument($walletAddr: String!) {\n    contracts(\n      where: { transaction: { account: { address: { _eq: $walletAddr } } } }\n      limit: 500\n      offset: 0\n      order_by: { transaction: { block: { timestamp: desc } } }\n    ) {\n      label\n      address\n      transaction {\n        block {\n          timestamp\n        }\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getInstantiateDetailByContractQueryDocument($contractAddress: String!) {\n    contracts_by_pk(address: $contractAddress) {\n      init_msg\n      transaction {\n        hash\n      }\n    }\n  }\n"
): typeof documents["\n  query getInstantiateDetailByContractQueryDocument($contractAddress: String!) {\n    contracts_by_pk(address: $contractAddress) {\n      init_msg\n      transaction {\n        hash\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getExecuteTransactionsByContractAddress(\n    $contractAddress: String!\n    $offset: Int!\n    $pageSize: Int!\n  ) {\n    contract_transactions(\n      where: {\n        contract: { address: { _eq: $contractAddress } }\n        transaction: { is_execute: { _eq: true } }\n      }\n      order_by: { transaction: { block: { timestamp: desc } } }\n      limit: $pageSize\n      offset: $offset\n    ) {\n      transaction {\n        hash\n        messages\n        success\n        account {\n          address\n        }\n        block {\n          height\n          timestamp\n        }\n      }\n    }\n  }\n"
): typeof documents["\n  query getExecuteTransactionsByContractAddress(\n    $contractAddress: String!\n    $offset: Int!\n    $pageSize: Int!\n  ) {\n    contract_transactions(\n      where: {\n        contract: { address: { _eq: $contractAddress } }\n        transaction: { is_execute: { _eq: true } }\n      }\n      order_by: { transaction: { block: { timestamp: desc } } }\n      limit: $pageSize\n      offset: $offset\n    ) {\n      transaction {\n        hash\n        messages\n        success\n        account {\n          address\n        }\n        block {\n          height\n          timestamp\n        }\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getExecuteTransactionsCountByContractAddress(\n    $contractAddress: String!\n  ) {\n    contract_transactions_aggregate(\n      where: {\n        contract: { address: { _eq: $contractAddress } }\n        transaction: { is_execute: { _eq: true } }\n      }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n"
): typeof documents["\n  query getExecuteTransactionsCountByContractAddress(\n    $contractAddress: String!\n  ) {\n    contract_transactions_aggregate(\n      where: {\n        contract: { address: { _eq: $contractAddress } }\n        transaction: { is_execute: { _eq: true } }\n      }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getContractListByCodeId($codeId: Int!, $offset: Int!, $pageSize: Int!) {\n    contracts(\n      where: { code_id: { _eq: $codeId } }\n      order_by: { transaction: { block: { timestamp: desc } } }\n      offset: $offset\n      limit: $pageSize\n    ) {\n      address\n      label\n      transaction {\n        block {\n          timestamp\n        }\n        account {\n          address\n        }\n      }\n    }\n  }\n"
): typeof documents["\n  query getContractListByCodeId($codeId: Int!, $offset: Int!, $pageSize: Int!) {\n    contracts(\n      where: { code_id: { _eq: $codeId } }\n      order_by: { transaction: { block: { timestamp: desc } } }\n      offset: $offset\n      limit: $pageSize\n    ) {\n      address\n      label\n      transaction {\n        block {\n          timestamp\n        }\n        account {\n          address\n        }\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getContractListCountByCodeId($codeId: Int!) {\n    contracts_aggregate(where: { code_id: { _eq: $codeId } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n"
): typeof documents["\n  query getContractListCountByCodeId($codeId: Int!) {\n    contracts_aggregate(where: { code_id: { _eq: $codeId } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n"];
export function graphql(
  source: "\n  query getCodeInfoByCodeId($codeId: Int!) {\n    codes_by_pk(id: $codeId) {\n      id\n      account {\n        address\n      }\n      transaction {\n        hash\n        block {\n          height\n          timestamp\n        }\n      }\n      code_proposals {\n        proposal_id\n        block {\n          height\n          timestamp\n        }\n      }\n      access_config_permission\n      access_config_addresses\n    }\n  }\n"
): typeof documents["\n  query getCodeInfoByCodeId($codeId: Int!) {\n    codes_by_pk(id: $codeId) {\n      id\n      account {\n        address\n      }\n      transaction {\n        hash\n        block {\n          height\n          timestamp\n        }\n      }\n      code_proposals {\n        proposal_id\n        block {\n          height\n          timestamp\n        }\n      }\n      access_config_permission\n      access_config_addresses\n    }\n  }\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
