import axios from "axios";
import { z } from "zod";

import type {
  Addr,
  ContractAddr,
  Option,
  PublicInfo,
  ContractInfo,
  ContractMigrationHistory,
} from "lib/types";
import {
  zAddr,
  zContractAddr,
  zContractHistoryRemark,
  zUtcDate,
} from "lib/types";
import { encode, libDecode } from "lib/utils";

export interface ContractCw2InfoRaw {
  data: string;
}

export interface ContractCw2Info {
  contract: string;
  version: string;
}

export interface ContractResponse {
  address: ContractAddr;
  contract_info: {
    code_id: string;
    creator: Addr;
    admin?: Addr;
    label: string;
    created?: {
      block_height: string;
      tx_index: string;
    };
    ibc_port_id: string;
    extension?: string;
  };
}

interface PublicInfoResponse {
  slug: string;
  name: string;
  address: ContractAddr;
  description: string;
  github: string;
}

export const queryData = async (
  endpoint: string,
  contractAddress: ContractAddr,
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
  contractAddress: ContractAddr
) => {
  const { data } = await axios.get<ContractResponse>(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contractAddress}`
  );
  return data;
};

export const queryContractCw2Info = async (
  endpoint: string,
  contractAddress: ContractAddr
) => {
  const { data } = await axios.get<ContractCw2InfoRaw>(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contractAddress}/raw/Y29udHJhY3RfaW5mbw%3D%3D`
  );
  return JSON.parse(libDecode(data.data)) as ContractCw2Info;
};

export const queryPublicInfo = async (
  chainName: string | undefined,
  chainId: string | undefined,
  contractAddress: ContractAddr
): Promise<Option<PublicInfo>> => {
  if (!chainName || !chainId)
    throw new Error("Invalid chain (queryPublicInfo)");
  return axios
    .get<PublicInfoResponse[]>(
      `https://cosmos-registry.alleslabs.dev/data/${chainName}/${chainId}/contracts.json`
    )
    .then(({ data }) => {
      const publicInfo = data.find((info) => info.address === contractAddress);
      return publicInfo
        ? { ...publicInfo, contractAddress: publicInfo.address }
        : undefined;
    });
};

const zContractsResponseItem = z
  .object({
    contract_address: zContractAddr,
    label: z.string(),
    admin: zAddr.nullable(),
    instantiator: zAddr,
    latest_updated: zUtcDate,
    latest_updater: zAddr,
    remark: zContractHistoryRemark,
  })
  .transform<ContractInfo>((val) => ({
    contractAddress: val.contract_address,
    label: val.label,
    admin: val.admin ? val.admin : undefined,
    instantiator: val.instantiator,
    latestUpdated: val.latest_updated,
    latestUpdater: val.latest_updater,
    remark: val.remark,
  }));

const zContractsResponse = z.object({
  items: z.array(zContractsResponseItem),
  total: z.number().nonnegative(),
});

export type ContractsResponse = z.infer<typeof zContractsResponse>;

export const getInstantiatedContractsByAddress = async (
  endpoint: string,
  address: Addr,
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
    .then(({ data }) => zContractsResponse.parse(data));

export const getAdminContractsByAddress = async (
  endpoint: string,
  address: Addr,
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
    .then(({ data }) => zContractsResponse.parse(data));

const zMigrationHistoriesResponseItem = z
  .object({
    code_id: z.number(),
    cw2_contract: z.string().nullable(),
    cw2_version: z.string().nullable(),
    height: z.number(),
    remark: zContractHistoryRemark,
    sender: zAddr,
    timestamp: zUtcDate,
    uploader: zAddr,
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
  contractAddress: ContractAddr,
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
    .then(({ data }) => zMigrationHistoriesResponse.parse(data));
