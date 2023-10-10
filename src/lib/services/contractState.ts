import axios from "axios";

import type {
  ContractAddr,
  ContractState,
  ResponseContractStates,
} from "lib/types";
import { libDecode, parseJsonStr, parseStateKey } from "lib/utils";

export const getContractStates = async (
  baseEndpoint: string,
  contractAddress: ContractAddr,
  numStatesToLoad: number,
  paginationKey: string | null
) => {
  const { data } = await axios.get<ResponseContractStates>(
    `${baseEndpoint}/cosmwasm/wasm/v1/contract/${contractAddress}/state?pagination.limit=${numStatesToLoad}${
      paginationKey ? `&pagination.key=${paginationKey}` : ""
    }`
  );

  const parsedStates = data.models.map<ContractState>((model) => ({
    rawKey: model.key,
    key: parseStateKey(model.key),
    value: parseJsonStr(libDecode(model.value)),
  }));

  return {
    states: parsedStates,
    rawStates: data.models,
    nextKey: data.pagination.next_key,
  };
};
