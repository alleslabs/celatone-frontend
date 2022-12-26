import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type { ContractAddr, HumanAddr } from "lib/types";
import { encode } from "lib/utils";

interface ContractResponse {
  address: ContractAddr;
  contract_info: {
    code_id: string;
    creator: HumanAddr | ContractAddr;
    admin?: HumanAddr | ContractAddr;
    label: string;
    created?: {
      block_height: number;
      tx_index: number;
    };
    ibc_port_id: string;
    extension?: string;
  };
}

interface BlockResponse {
  block: {
    header: {
      time: string;
    };
  };
}

interface BalancesResponse {
  balances: Coin[];
}

interface PublicInfoResponse {
  slug: string;
  name: string;
  address: ContractAddr;
  description: string;
}

export interface InstantiateInfo {
  contractAddress: ContractAddr;
  codeId: string;
  instantiator: HumanAddr | ContractAddr;
  admin?: HumanAddr | ContractAddr;
  label: string;
  createdHeight: number;
  createdTime: Date;
  ibcPortId: string;
  raw: ContractResponse;
}

export interface PublicInfo {
  slug: string;
  name: string;
  contractAddress: ContractAddr;
  description: string;
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

export const queryInstantiateInfo = async (
  endpoint: string,
  contractAddress: ContractAddr
): Promise<InstantiateInfo> => {
  const res = await queryContract(endpoint, contractAddress);

  // TODO: check `created` field for contracts created with proposals
  let createdHeight;
  let createdTime;
  if (res.contract_info.created) {
    const { data } = await axios.get<BlockResponse>(
      `${endpoint}/cosmos/base/tendermint/v1beta1/blocks/${res.contract_info.created.block_height}`
    );
    createdHeight = res.contract_info.created.block_height;
    createdTime = new Date(data.block.header.time);
  } else {
    // TODO: revisit default value
    createdHeight = 0;
    createdTime = new Date(0);
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
  endpoint: string,
  contractAddress: ContractAddr
) => {
  const { data } = await axios.get<BalancesResponse>(
    `${endpoint}/cosmos/bank/v1beta1/balances/${contractAddress}?pagination.limit=0`
  );
  return data;
};

export const queryPublicInfo = async (
  chainName: string | undefined,
  chainId: string | undefined,
  contractAddress: ContractAddr
): Promise<PublicInfo | undefined> => {
  if (!chainName || !chainId) return undefined;
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
