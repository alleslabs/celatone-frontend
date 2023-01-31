import axios from "axios";
import type { Dayjs } from "dayjs";
import type { GraphQLClient } from "graphql-request";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import { getBlockTimestampByHeightQueryDocument } from "lib/data/queries";
import type {
  Balance,
  ContractAddr,
  HumanAddr,
  Option,
  PublicInfo,
} from "lib/types";
import { encode, parseDateDefault } from "lib/utils";

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
  createdTime: Option<Dayjs>;
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
  indexerGraphClient: GraphQLClient,
  contractAddress: ContractAddr
): Promise<InstantiateInfo> => {
  const res = await queryContract(endpoint, contractAddress);

  // TODO: check `created` field for contracts created with proposals
  let createdHeight = -1;
  let createdTime;
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
): Promise<Option<Balance[]>> => {
  if (!chainName || !chainId) return undefined;
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
