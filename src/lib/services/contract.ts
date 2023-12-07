import axios from "axios";

import type { Addr, ContractAddr, Option, PublicInfo } from "lib/types";
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
