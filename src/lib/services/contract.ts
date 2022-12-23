import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import type { ContractAddr } from "lib/types";
import { encode } from "lib/utils";

interface ContractResponse {
  address: ContractAddr;
  contract_info: {
    code_id: string;
    creator: string;
    admin: string;
    label: string;
    created?: {
      block_height: number;
      tx_index: number;
    };
    ibc_port_id: string;
    extension: string;
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

export interface InstantiateInfo {
  address: ContractAddr;
  codeId: string;
  instantiator: string;
  admin: string;
  label: string;
  createdHeight: number;
  createdTime: Date;
  ibcPortId: string;
  raw: ContractResponse;
}

export interface PublicInfo {
  slug: string;
  name: string;
  address: ContractAddr;
  description: string;
}

export const queryData = async (
  endpoint: string,
  contractAddr: ContractAddr,
  msg: string
) => {
  const b64 = encode(msg);
  const { data } = await axios.get(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contractAddr}/smart/${b64}`
  );
  return data;
};

export const queryContract = async (
  endpoint: string,
  contractAddr: ContractAddr
) => {
  const { data } = await axios.get<ContractResponse>(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contractAddr}`
  );
  return data;
};

export const queryInstantiateInfo = async (
  endpoint: string,
  contractAddr: ContractAddr
): Promise<InstantiateInfo> => {
  const res = await queryContract(endpoint, contractAddr);

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
    address: res.address,
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
  contractAddr: ContractAddr
) => {
  const { data } = await axios.get<BalancesResponse>(
    `${endpoint}/cosmos/bank/v1beta1/balances/${contractAddr}?pagination.limit=0`
  );
  return data;
};

export const queryPublicInfo = async (
  chainName: string | undefined,
  chainId: string | undefined,
  contractAddr: ContractAddr
): Promise<PublicInfo | undefined> => {
  if (!chainName || !chainId) return undefined;
  return axios
    .get<PublicInfo[]>(
      `https://cosmos-registry.alleslabs.dev/data/${chainName}/${chainId}/contracts.json`
    )
    .then(({ data }) => data.find((info) => info.address === contractAddr));
};
