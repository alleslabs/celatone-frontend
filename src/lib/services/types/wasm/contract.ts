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
import { parseTxHash, snakeToCamel } from "lib/utils";

export interface ContractCw2Info {
  contract: string;
  version: string;
}

const zContractCreated = z.object({
  block_height: z.coerce.number(),
  tx_index: z.coerce.number(),
});

const zContractRest = z.object({
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
export type ContractRest = z.infer<typeof zContractRest>;

const zContractsResponseItem = z
  .object({
    contract_address: zBechAddr32,
    label: z.string(),
    admin: zBechAddr.nullable(),
    instantiator: zBechAddr.nullable(),
    latest_updated: zUtcDate.nullable(),
    latest_updater: zBechAddr.optional(),
    remark: zContractHistoryRemark.optional(),
  })
  .transform<ContractInfo>((val) => ({
    contractAddress: val.contract_address,
    label: val.label,
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

const zContractsResponseItemLcd = zBechAddr32.transform<ContractInfo>(
  (val) => ({
    contractAddress: val,
    label: "",
    admin: undefined,
    instantiator: undefined,
    latestUpdated: undefined,
    latestUpdater: undefined,
    remark: undefined,
  })
);

export const zContractsResponseLcd = z
  .object({
    contracts: z.array(zContractsResponseItemLcd).default([]), // by code id case
    contract_addresses: z.array(zContractsResponseItemLcd).optional(),
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
    contract_rest: zContractRest.nullable(),
    project_info: zProjectInfo.nullable(),
    public_info: zPublicContractInfo.nullable(),
  })
  .transform(({ contract_rest, ...rest }) => ({
    ...snakeToCamel(rest),
    contractRest: contract_rest,
  }));
export type ContractData = z.infer<typeof zContractData>;

export const zContractLcd = zContractRest.transform<ContractData>((val) => ({
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
}));

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

export const zMigrationHistoriesResponseItemLcd = z
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
export type MigrationHistoriesResponseItemLcd = z.infer<
  typeof zMigrationHistoriesResponseItemLcd
>;

export const zMigrationHistoriesResponseLcd = z.object({
  entries: z.array(zMigrationHistoriesResponseItemLcd),
  pagination: zPagination,
});
export type MigrationHistoriesResponseLcd = z.infer<
  typeof zMigrationHistoriesResponseLcd
>;

export const zInstantiatedContractsLcd = z
  .object({
    contract_addresses: zBechAddr32.array(),
  })
  .transform(snakeToCamel);
