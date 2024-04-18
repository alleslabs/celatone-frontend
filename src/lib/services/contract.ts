import axios from "axios";
import { z } from "zod";

import type {
  BechAddr,
  BechAddr32,
  ContractInfo,
  ContractMigrationHistory,
} from "lib/types";
import {
  zBechAddr,
  zBechAddr32,
  zContractHistoryRemark,
  zProjectInfo,
  zPublicContractInfo,
  zUtcDate,
} from "lib/types";
import { encode, parseTxHash, parseWithError, snakeToCamel } from "lib/utils";

export interface ContractCw2Info {
  contract: string;
  version: string;
}

const zContractRest = z.object({
  address: zBechAddr32,
  contract_info: z.object({
    code_id: z.string(),
    creator: zBechAddr,
    admin: zBechAddr,
    label: z.string(),
    created: z
      .object({
        block_height: z.string(),
        tx_index: z.string(),
      })
      .nullable(),
    ibc_port_id: z.string(),
    extension: z.string().nullable(),
  }),
});
export type ContractRest = z.infer<typeof zContractRest>;

export const queryData = async (
  endpoint: string,
  contractAddress: BechAddr32,
  msg: string
) => {
  const b64 = encode(msg);
  const { data } = await axios.get(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${b64}`
  );
  return data;
};

export const queryContract = async (
  endpoint: string,
  contractAddress: BechAddr32
) =>
  axios(`${endpoint}/cosmwasm/wasm/v1/contract/${contractAddress}`).then(
    ({ data }) => parseWithError(zContractRest, data)
  );

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

const zContractsResponse = z.object({
  items: z.array(zContractsResponseItem),
  total: z.number().nonnegative(),
});

export type ContractsResponse = z.infer<typeof zContractsResponse>;

export const getContracts = async (
  endpoint: string,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zContractsResponse, data));

export const getInstantiatedContractsByAddress = async (
  endpoint: string,
  address: BechAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(address)}/wasm/instantiated-contracts`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => parseWithError(zContractsResponse, data));

export const getAdminContractsByAddress = async (
  endpoint: string,
  address: BechAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/wasm/admin-contracts`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zContractsResponse, data));

export const zContract = z
  .object({
    address: zBechAddr32,
    admin: zBechAddr.nullable(),
    code_id: z.number().positive(),
    code_hash: z.string().transform(parseTxHash),
    created_height: z.number(),
    created_timestamp: zUtcDate,
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

const zContractData = z
  .object({
    project_info: zProjectInfo.nullable(),
    public_info: zPublicContractInfo.nullable(),
    contract: zContract.nullable(),
    contract_rest: zContractRest.nullable(),
  })
  .transform((value) => ({
    projectInfo: value.project_info,
    publicInfo: value.public_info,
    contract: value.contract,
    contractRest: value.contract_rest,
  }));
export type ContractData = z.infer<typeof zContractData>;

export const getContractDataByContractAddress = async (
  endpoint: string,
  contractAddress: BechAddr32,
  isGov: boolean
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(contractAddress)}/info`, {
      params: {
        is_gov: isGov,
      },
    })
    .then(({ data }) => parseWithError(zContractData, data));

const zContractTableCounts = z
  .object({
    tx: z.number().nullish(),
    migration: z.number().nullish(),
    related_proposal: z.number().nullish(),
  })
  .transform(snakeToCamel);
export type ContractTableCounts = z.infer<typeof zContractTableCounts>;

export const getContractTableCounts = async (
  endpoint: string,
  contractAddress: BechAddr32,
  isGov: boolean
): Promise<ContractTableCounts> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(contractAddress)}/table-counts`, {
      params: {
        is_gov: isGov,
      },
    })
    .then(({ data }) => parseWithError(zContractTableCounts, data));

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
  .transform<ContractMigrationHistory>((val) => ({
    codeId: val.code_id,
    cw2Contract: val.cw2_contract,
    cw2Version: val.cw2_version,
    height: val.height,
    remark: val.remark,
    sender: val.sender,
    timestamp: val.timestamp,
    uploader: val.uploader,
  }));
const zMigrationHistoriesResponse = z.object({
  items: z.array(zMigrationHistoriesResponseItem),
});

export type MigrationHistoriesResponse = z.infer<
  typeof zMigrationHistoriesResponse
>;

export const getMigrationHistoriesByContractAddress = async (
  endpoint: string,
  contractAddress: BechAddr32,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(contractAddress)}/migrations`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zMigrationHistoriesResponse, data));

const zContractQueryMsgs = z
  .object({
    query: z.array(z.string()),
  })
  .transform((val) =>
    val.query.map<[string, string]>((msg) => [msg, `{"${msg}": {}}`])
  );

export const getContractQueryMsgs = async (
  endpoint: string,
  contractAddress: BechAddr32
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(contractAddress)}/query-msgs`)
    .then(({ data }) => parseWithError(zContractQueryMsgs, data));

export const getContractsByCodeId = async (
  endpoint: string,
  codeId: number,
  limit: number,
  offset: number
): Promise<ContractsResponse> =>
  axios
    .get(`${endpoint}/${codeId}/contracts`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zContractsResponse, data));
