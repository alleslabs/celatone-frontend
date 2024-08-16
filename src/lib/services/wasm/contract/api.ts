import axios from "axios";

import type {
  ContractsResponse,
  ContractTableCounts,
} from "lib/services/types/";
import {
  zAllAdminContractsResponse,
  zContractAdminsResponse,
  zContractData,
  zContractsResponse,
  zContractTableCounts,
  zMigrationHistoriesResponse,
} from "lib/services/types/";
import type { BechAddr, BechAddr32, Dict } from "lib/types";
import { parseWithError } from "lib/utils";

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
    .get(`${endpoint}/${encodeURI(address)}/wasm/instantiated-contracts`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zContractsResponse, data));

export const getAdminContractsByAddress = async (
  endpoint: string,
  address: BechAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/${encodeURI(address)}/wasm/admin-contracts`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zContractsResponse, data));

export const getContractData = async (
  endpoint: string,
  contractAddress: BechAddr32,
  isGov: boolean
) =>
  axios
    .get(`${endpoint}/${encodeURI(contractAddress)}/info`, {
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
    .get(`${endpoint}/${encodeURI(contractAddress)}/table-counts`, {
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
    .get(`${endpoint}/${encodeURI(contractAddress)}/migrations`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zMigrationHistoriesResponse, data));

export const getContractsByCodeId = async (
  endpoint: string,
  codeId: number,
  limit: number,
  offset: number
): Promise<ContractsResponse> =>
  axios
    .get(`${endpoint}/${encodeURIComponent(codeId)}/contracts`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zContractsResponse, data));

export const getAllAdminContractsByAddress = async (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(`${endpoint}/${encodeURI(address)}/wasm/all-admin-contracts`)
    .then(({ data }) => parseWithError(zAllAdminContractsResponse, data));

export const getAdminsByContractAddresses = async (
  endpoint: string,
  contractAddresses: BechAddr32[]
) =>
  axios
    .get(`${endpoint}/contract-admins`, {
      params: {
        contract_addresses: contractAddresses.join(","),
      },
    })
    .then(({ data }) =>
      parseWithError(zContractAdminsResponse, data).items.reduce<
        Dict<BechAddr32, BechAddr>
      >(
        (prev, item) => ({
          ...prev,
          [item.contractAddress]: item.admin ?? undefined,
        }),
        {}
      )
    );
