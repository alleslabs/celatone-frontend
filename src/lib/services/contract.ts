import type { Coin } from "@cosmjs/stargate";
import axios from "axios";

import { encode } from "lib/utils";

interface ContractResponse {
  address: string;
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
  address: string;
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
  address: string;
  description: string;
}

export const queryData = async (
  endpoint: string,
  contract: string,
  msg: string
) => {
  const b64 = encode(msg);
  const { data } = await axios.get(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contract}/smart/${b64}`
  );
  return data;
};

export const queryContract = async (endpoint: string, contract: string) => {
  const { data } = await axios.get<ContractResponse>(
    `${endpoint}/cosmwasm/wasm/v1/contract/${contract}`
  );
  return data;
};

export const queryInstantiateInfo = async (
  endpoint: string,
  contract: string
): Promise<InstantiateInfo> => {
  const res = await queryContract(endpoint, contract);

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
  contract: string
) => {
  const { data } = await axios.get<BalancesResponse>(
    `${endpoint}/cosmos/bank/v1beta1/balances/${contract}?pagination.limit=0`
  );
  return data;
};

export const queryPublicInfo = async (
  chainName: string,
  chainId: string,
  contract: string
): Promise<PublicInfo | undefined> => {
  return axios
    .get<PublicInfo[]>(
      `https://cosmos-registry.alleslabs.dev/data/${chainName}/${chainId}/contracts.json`
    )
    .then(({ data }) => data.find((info) => info.address === contract));
};
