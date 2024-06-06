import axios from "axios";

import {
  zContractLcd,
  zContractQueryMsgs,
  zContractsResponseLcd,
  zInstantiatedContractsLcd,
  zMigrationHistoriesResponseLcd,
} from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { BechAddr20, BechAddr32, JsonDataType, Option } from "lib/types";
import { encode, libEncode, parseWithError } from "lib/utils";

export const getContractQueryLcd = (
  endpoint: string,
  contractAddress: BechAddr32,
  msg: string
): JsonDataType =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/smart/${encode(msg)}`
    )
    .then(({ data }) => data);

export const getContractLcd = (endpoint: string, contractAddress: BechAddr32) =>
  axios(
    `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}`
  ).then(({ data }) => parseWithError(zContractLcd, data));

export const getContractsByCodeIdLcd = (
  endpoint: string,
  codeId: number,
  paginationKey: Option<string>
) =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/code/${encodeURIComponent(codeId)}/contracts`,
      {
        params: {
          "pagination.limit": 10,
          "pagination.reverse": true,
          "pagination.key": paginationKey,
        },
      }
    )
    .then(({ data }) => parseWithError(zContractsResponseLcd, data));

export const getContractQueryMsgsLcd = async (
  endpoint: string,
  contractAddress: BechAddr32
) => {
  const msg = '{"": {}}';
  const encodedMsg = libEncode(msg);

  const data = await axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/smart/${encodeURI(encodedMsg)}`
    )
    .catch(({ response }) => {
      const resMsg = response.data.message as string;

      const sylviaRegex = /Messages supported by this contract: (.*?)$/;
      const contentMatch = sylviaRegex.exec(resMsg);

      if (contentMatch && contentMatch[1]) {
        const content = contentMatch[1].split(",");
        const cmds = content.map((each) => each.trim());

        return { query: cmds };
      }

      const matches = resMsg.match(/`(.*?)`/g);
      const cmds = matches
        ? matches.slice(1).map((match) => match.replace(/`/g, ""))
        : [];

      return { query: cmds };
    });

  return parseWithError(zContractQueryMsgs, data);
};

export const getMigrationHistoriesByContractAddressLcd = async (
  endpoint: string,
  contractAddress: BechAddr32,
  limit: number,
  paginationKey: Option<string>
) =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/history`,
      {
        params: {
          "pagination.limit": limit,
          "pagination.reverse": true,
          "pagination.key": paginationKey,
        },
      }
    )
    .then(({ data }) => parseWithError(zMigrationHistoriesResponseLcd, data));
export const getInstantiatedContractsByAddressLcd = (
  endpoint: string,
  address: BechAddr20
) =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contracts/creator/${encodeURI(address)}`,
      {
        params: {
          "pagination.limit": 100,
        },
      }
    )
    .then(({ data }) => {
      const { contractAddresses } = parseWithError(
        zInstantiatedContractsLcd,
        data
      );

      return contractAddresses.map<ContractLocalInfo>((contractAddress) => ({
        contractAddress,
        instantiator: address,
        label: "",
      }));
    });
