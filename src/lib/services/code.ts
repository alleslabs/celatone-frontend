import axios from "axios";

import type { Addr, InstantiatePermission } from "lib/types";

interface CodeIdInfoResponse {
  code_info: {
    code_id: string;
    creator: Addr;
    data_hash: string;
    instantiate_permission: {
      permission: InstantiatePermission;
      address: Addr;
      addresses: Addr[];
    };
  };
  data: string;
}

export const getCodeIdInfo = async (
  endpoint: string,
  id: number
): Promise<CodeIdInfoResponse> => {
  const { data } = await axios.get<CodeIdInfoResponse>(
    `${endpoint}cosmwasm/wasm/v1/code/${id}`
  );
  return data;
};
