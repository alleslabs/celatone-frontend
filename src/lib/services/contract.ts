import axios from "axios";
import type { GraphQLClient } from "graphql-request";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import { getBlockTimestampByHeightQueryDocument } from "lib/query";
import type {
  Addr,
  Balance,
  ContractAddr,
  Option,
  PublicInfo,
} from "lib/types";
import { encode, libDecode, parseDateDefault } from "lib/utils";

export interface ContractCw2InfoRaw {
  data: string;
}

export interface ContractCw2Info {
  contract: string;
  version: string;
}

interface ContractResponse {
  address: ContractAddr;
  contract_info: {
    code_id: string;
    creator: Addr;
    admin?: Addr;
    label: string;
    created?: {
      block_height: number;
      tx_index: number;
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

export interface InstantiateInfo {
  contractAddress: ContractAddr;
  codeId: string;
  instantiator: Addr;
  admin: Option<Addr>;
  label: string;
  createdHeight: Option<number>;
  createdTime: Option<Date>;
  ibcPortId: string;
  raw: ContractResponse;
}

export const queryData = async (
  endpoint: string,
  contractAddress: ContractAddr,
  msg: string
) => {
  const b64 = encode(msg);
  const { data } = await axios.get(
    `${endpoint}cosmwasm/wasm/v1/contract/${contractAddress}/smart/${b64}`
  );
  return data;
};

export const queryContract = async (
  endpoint: string,
  contractAddress: ContractAddr
) => {
  const { data } = await axios.get<ContractResponse>(
    `${endpoint}cosmwasm/wasm/v1/contract/${contractAddress}`
  );
  return data;
};

export const queryContractCw2Info = async (
  endpoint: string,
  contractAddress: ContractAddr
) => {
  const { data } = await axios.get<ContractCw2InfoRaw>(
    `${endpoint}cosmwasm/wasm/v1/contract/${contractAddress}/raw/Y29udHJhY3RfaW5mbw%3D%3D`
  );
  return JSON.parse(libDecode(data.data)) as ContractCw2Info;
};

export const queryInstantiateInfo = async (
  endpoint: string,
  indexerGraphClient: GraphQLClient,
  contractAddress: ContractAddr
): Promise<InstantiateInfo> => {
  const res = await queryContract(endpoint, contractAddress);

  // TODO: query height from gql instead when supporting Terra
  let createdHeight: Option<number>;
  let createdTime: Option<Date>;
  if (res.contract_info.created) {
    createdHeight = res.contract_info.created.block_height;
    await indexerGraphClient
      .request(getBlockTimestampByHeightQueryDocument, {
        height: createdHeight,
      })
      .then(({ blocks_by_pk }) => {
        createdTime = blocks_by_pk
          ? parseDateDefault(blocks_by_pk?.timestamp)
          : undefined;
      })
      .catch(() => {});
  }

  return {
    contractAddress: res.address,
    codeId: res.contract_info.code_id,
    instantiator: res.contract_info.creator,
    admin: res.contract_info.admin,
    label: res.contract_info.label,
    createdHeight,
    createdTime,
    ibcPortId: res.contract_info.ibc_port_id,
    raw: res,
  };
};

export const queryContractBalances = async (
  chainName: Option<string>,
  chainId: Option<string>,
  contractAddress: ContractAddr
): Promise<Balance[]> => {
  if (!chainName || !chainId)
    throw new Error("Invalid chain (queryContractBalances)");
  const { data } = await axios.get<Balance[]>(
    `${CELATONE_API_ENDPOINT}/balances/${getChainApiPath(
      chainName
    )}/${chainId}/${contractAddress}`
  );
  return data;
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
