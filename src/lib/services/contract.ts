import axios from "axios";
import { z } from "zod";

import type {
  Addr,
  ContractAddr,
  ContractInfo,
  ContractHistoryRemark,
  RemarkType,
} from "lib/types";
import { RemarkOperation, zAddr, zContractAddr, zUtcDate } from "lib/types";
import { encode, libDecode, snakeToCamel } from "lib/utils";

interface ContractCw2InfoRaw {
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

const zContractsResponseItem = z
  .object({
    contract_address: zContractAddr,
    label: z.string(),
    admin: zAddr.nullable(),
    instantiator: zAddr,
    latest_updated: zUtcDate,
    latest_updater: zAddr,
    remark: z
      .object({
        operation: z.nativeEnum(RemarkOperation),
        type: z.string(),
        value: z.string(),
      })
      .transform<ContractHistoryRemark>((val) => ({
        operation: val.operation,
        type: val.type as RemarkType, // TODO: remove type assertion,
        value: val.value,
      })),
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
  address: string,
  isGov: boolean
): Promise<ContractTableCounts> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(address)}/table-counts`, {
      params: {
        is_gov: isGov,
      },
    })
    .then((res) => zContractTableCounts.parse(res.data));
