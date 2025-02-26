import axios from "axios";

import type {
  ContractCw2InfoRest,
  MigrationHistoriesResponseItemRest,
  MigrationHistoriesResponseRest,
} from "lib/services/types";
import {
  zContractCw2InfoRest,
  zContractQueryMsgs,
  zContractRest,
  zContractsResponseRest,
  zInstantiatedContractsRest,
  zMigrationHistoriesResponseRest,
} from "lib/services/types";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  BechAddr,
  BechAddr32,
  JsonDataType,
  Nullable,
  Option,
} from "lib/types";
import { encode, libEncode, parseWithError } from "lib/utils";

export const getContractQueryRest = (
  endpoint: string,
  contractAddress: BechAddr32,
  msg: string
): JsonDataType =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/smart/${encode(msg)}`
    )
    .then(({ data }) => data);

export const getContractRest = (
  endpoint: string,
  contractAddress: BechAddr32
) =>
  axios(
    `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}`
  ).then(({ data }) => parseWithError(zContractRest, data));

export const getContractsByCodeIdRest = (
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
    .then(({ data }) => parseWithError(zContractsResponseRest, data));

export const getContractQueryMsgsRest = async (
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

export const getMigrationHistoriesByContractAddressRest = async (
  endpoint: string,
  contractAddress: BechAddr32
): Promise<MigrationHistoriesResponseRest> => {
  const entries: MigrationHistoriesResponseItemRest[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/history`,
        {
          params: {
            "pagination.reverse": true,
            "pagination.key": paginationKey,
          },
        }
      )
      .then(({ data }) =>
        parseWithError(zMigrationHistoriesResponseRest, data)
      );

    entries.push(...res.entries);

    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    entries,
    pagination: {
      nextKey: null,
      total: entries.length,
    },
  };
};

export const getInstantiatedContractsByAddressRest = (
  endpoint: string,
  address: BechAddr
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
        zInstantiatedContractsRest,
        data
      );

      return contractAddresses.map<ContractLocalInfo>((contractAddress) => ({
        contractAddress,
        instantiator: address,
        label: "",
      }));
    });

export const getContractCw2InfoRest = async (
  endpoint: string,
  contractAddress: BechAddr32
): Promise<ContractCw2InfoRest> =>
  axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/raw/Y29udHJhY3RfaW5mbw%3D%3D`
    )
    .then(({ data }) => parseWithError(zContractCw2InfoRest, data));
