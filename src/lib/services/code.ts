import axios from "axios";

import type { ContractAddr, HumanAddr } from "lib/types";

interface CodeIdInfoResponse {
  code_info: {
    code_id: string;
    creator: HumanAddr | ContractAddr;
    data_hash: string;
    instantiate_permission: {
      permission: string;
      address: string;
      addresses: string[];
    };
  };
  data: string;
}

export const getCodeIdInfo = async (
  endpoint: string,
  id: number
): Promise<CodeIdInfoResponse> => {
  const { data } = await axios.get<CodeIdInfoResponse>(
    `${endpoint}/cosmwasm/wasm/v1/code/${id}`
  );
  return data;
};
