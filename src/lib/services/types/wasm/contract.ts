import z from "zod";

import type { ContractInfo, ContractMigrationHistory } from "lib/types";
import {
  zBechAddr,
  zBechAddr32,
  zContractHistoryRemark,
  zPagination,
  zProjectInfo,
  zPublicContractInfo,
  zRemarkOperation,
  zUtcDate,
} from "lib/types";
import { decode, parseTxHash, snakeToCamel } from "lib/utils";

const zContractCreated = z.object({
  block_height: z.coerce.number(),
  tx_index: z.coerce.number(),
});

const zContractRestApi = z.object({
  address: zBechAddr32,
  contract_info: z.object({
    code_id: z.string(),
    creator: zBechAddr,
    admin: z.string(),
    label: z.string(),
    created: zContractCreated.nullable(),
    ibc_port_id: z.string(),
    extension: z.string().nullable(),
  }),
});
export type ContractRestApi = z.infer<typeof zContractRestApi>;

const zContractsResponseItem = z
  .object({
    contract_address: zBechAddr32,
    label: z.string(),
    code_id: z.number(),
    admin: zBechAddr.nullable(),
    instantiator: zBechAddr.nullable(),
    latest_updated: zUtcDate.nullable(),
    latest_updater: zBechAddr.optional(),
    remark: zContractHistoryRemark.optional(),
  })
  .transform<ContractInfo>((val) => ({
    contractAddress: val.contract_address,
    label: val.label,
    codeId: val.code_id,
    // TODO: change contract info optional fields to nullable fields
    admin: val.admin ?? undefined,
    instantiator: val.instantiator ?? undefined,
    latestUpdated: val.latest_updated ?? undefined,
    latestUpdater: val.latest_updater,
    remark: val.remark,
  }));

export const zContractsResponse = z.object({
  items: z.array(zContractsResponseItem),
  total: z.number().nonnegative(),
});

export type ContractsResponse = z.infer<typeof zContractsResponse>;

const zContractsResponseItemRest = zBechAddr32.transform<ContractInfo>(
  (val) => ({
    contractAddress: val,
    label: "",
    codeId: undefined,
    admin: undefined,
    instantiator: undefined,
    latestUpdated: undefined,
    latestUpdater: undefined,
    remark: undefined,
  })
);

export const zContractsResponseRest = z
  .object({
    contracts: z.array(zContractsResponseItemRest).default([]), // by code id case
    contract_addresses: z.array(zContractsResponseItemRest).optional(),
    pagination: zPagination,
  })
  .transform((val) => ({
    contracts: val.contract_addresses ?? val.contracts,
    pagination: val.pagination,
  }));

export const zContract = z
  .object({
    address: zBechAddr32,
    admin: zBechAddr.nullable(),
    code_id: z.number().positive(),
    code_hash: z.string().transform(parseTxHash),
    created_height: z.number().nullable(),
    created_timestamp: zUtcDate.nullable(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    init_msg: z.string(),
    init_proposal_id: z.number().nullish(),
    init_proposal_title: z.string().nullish(),
    init_tx_hash: z.string().transform(parseTxHash).nullable(),
    instantiator: zBechAddr,
    label: z.string(),
  })
  .transform(snakeToCamel);
export type Contract = z.infer<typeof zContract>;

export const zContractData = z
  .object({
    contract: zContract,
    contract_rest: zContractRestApi.nullable(),
    project_info: zProjectInfo.nullable(),
    public_info: zPublicContractInfo.nullable(),
  })
  .transform(({ contract_rest, ...rest }) => ({
    ...snakeToCamel(rest),
    contractRest: contract_rest,
  }));
export type ContractData = z.infer<typeof zContractData>;

export const zContractRest = zContractRestApi.transform<ContractData>(
  (val) => ({
    contract: {
      address: val.address,
      admin: val.contract_info.admin.length
        ? zBechAddr.parse(val.contract_info.admin)
        : null,
      codeId: Number(val.contract_info.code_id),
      codeHash: "",
      createdHeight: val.contract_info.created
        ? Number(val.contract_info.created.block_height)
        : null,
      createdTimestamp: null,
      cw2Contract: null,
      cw2Version: null,
      initMsg: "",
      initProposalId: null,
      initProposalTitle: null,
      initTxHash: null,
      instantiator: val.contract_info.creator,
      label: val.contract_info.label,
    },
    contractRest: val,
    projectInfo: null,
    publicInfo: null,
  })
);

export const zContractTableCounts = z
  .object({
    tx: z.number().nullish(),
    migration: z.number().nullish(),
    related_proposal: z.number().nullish(),
  })
  .transform(snakeToCamel);
export type ContractTableCounts = z.infer<typeof zContractTableCounts>;

const zMigrationHistoriesResponseItem = z
  .object({
    code_id: z.number().positive(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    height: z.number(),
    remark: zContractHistoryRemark,
    sender: zBechAddr,
    timestamp: zUtcDate,
    uploader: zBechAddr,
  })
  .transform<ContractMigrationHistory>(snakeToCamel);

export const zMigrationHistoriesResponse = z.object({
  items: z.array(zMigrationHistoriesResponseItem),
});

export type MigrationHistoriesResponse = z.infer<
  typeof zMigrationHistoriesResponse
>;

export const zContractQueryMsgs = z
  .object({
    query: z.array(z.string()),
  })
  .transform((val) =>
    val.query.map<[string, string]>((msg) => [msg, `{"${msg}": {}}`])
  );

export const zMigrationHistoriesResponseItemRest = z
  .object({
    operation: zRemarkOperation,
    code_id: z.coerce.number().positive(),
    updated: zContractCreated,
    msg: z.object({}).passthrough(),
  })
  .transform<ContractMigrationHistory>((val) => ({
    codeId: val.code_id,
    codeName: undefined,
    height: Number(val.updated.block_height),
    timestamp: null,
    uploader: null,
    remark: {
      operation: val.operation,
      type: null,
    },
    sender: null,
    cw2Contract: null,
    cw2Version: null,
    msg: JSON.stringify(val.msg),
  }));
export type MigrationHistoriesResponseItemRest = z.infer<
  typeof zMigrationHistoriesResponseItemRest
>;

export const zMigrationHistoriesResponseRest = z.object({
  entries: z.array(zMigrationHistoriesResponseItemRest),
  pagination: zPagination,
});
export type MigrationHistoriesResponseRest = z.infer<
  typeof zMigrationHistoriesResponseRest
>;

export const zInstantiatedContractsRest = z
  .object({
    contract_addresses: zBechAddr32.array(),
  })
  .transform(snakeToCamel);

export const zContractCw2InfoRest = z
  .object({
    data: z.string().nullable(),
  })
  .transform((val) => (val.data ? JSON.parse(decode(val.data)) : null))
  .pipe(
    z
      .object({
        contract: z.string(),
        version: z.string(),
      })
      .nullable()
  );

export type ContractCw2InfoRest = z.infer<typeof zContractCw2InfoRest>;

const zAllAdminContractsResponseItem = z
  .object({
    contract_address: zBechAddr32,
    label: z.string(),
    code_id: z.number(),
    instantiator: zBechAddr.nullable(),
  })
  .transform<ContractInfo>((val) => ({
    contractAddress: val.contract_address,
    label: val.label,
    codeId: val.code_id,
    admin: undefined,
    instantiator: val.instantiator ?? undefined,
    latestUpdated: undefined,
    latestUpdater: undefined,
    remark: undefined,
  }));

export const zAllAdminContractsResponse = z.object({
  items: zAllAdminContractsResponseItem.array(),
});

export const zContractAdminsResponse = z
  .object({
    items: z
      .object({
        contract_address: zBechAddr32,
        admin: zBechAddr.nullable(),
      })
      .array(),
  })
  .transform(snakeToCamel);
