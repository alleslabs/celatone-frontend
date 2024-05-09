import axios from "axios";

import {
  zContractData,
  zContractQueryMsgs,
  zContractRest,
  zContractsResponse,
  zContractTableCounts,
  zMigrationHistoriesResponse,
} from "lib/services/types/";
import type {
  ContractsResponse,
  ContractTableCounts,
} from "lib/services/types/";
import type { BechAddr, BechAddr32 } from "lib/types";
import { encode, parseWithError } from "lib/utils";

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
