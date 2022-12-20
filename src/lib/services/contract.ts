import axios from "axios";

import { encode } from "lib/utils";

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

interface ContractResponse {
  height: string;
  result: {
    address: string;
    code_id: number;
    creator: string;
    label: string;
  };
}

interface BlockResponse {
  block: {
    header: {
      time: string;
    };
  };
}

export const queryContract = async (endpoint: string, contract: string) => {
  // TODO: change to `${endpoint}/cosmwasm/wasm/v1/contract/${contract}`
  const { data } = await axios.get<ContractResponse>(
    `${endpoint}/wasm/contract/${contract}`
  );
  return data;
};

export const queryContractWithTime = async (
  endpoint: string,
  contract: string
) => {
  const res = await queryContract(endpoint, contract);
  const { data } = await axios.get<BlockResponse>(
    `${endpoint}/cosmos/base/tendermint/v1beta1/blocks/${res.height}`
  );

  return {
    address: res.result.address,
    instantiator: res.result.creator,
    label: res.result.label,
    created: new Date(data.block.header.time),
  };
};

export const getCodeIdInfo = async (endpoint: string, id: number) => {
  const { data } = await axios.get(`${endpoint}/cosmwasm/wasm/v1/code/${id}`);
  return data;
};
