import axios from "axios";

import type {
  ContractAddr,
  ContractState,
  ResponseContractStates,
} from "lib/types";
import { parseKey, parseValue } from "lib/utils";

export const getContractStates = async (
  baseEndpoint: string,
  contractAddress: ContractAddr,
  paginationKey: string | null
) => {
  const { data } = await axios.get<ResponseContractStates>(
    `${baseEndpoint}/cosmwasm/wasm/v1/contract/${contractAddress}/state?pagination.limit=100${
      paginationKey ? `&pagination.key=${paginationKey}` : ""
    }`
  );

  const parsedStates = data.models.map<ContractState>((model) => ({
    rawKey: model.key,
    key: parseKey(model.key),
    value: parseValue(model.value),
  }));

  return {
    states: parsedStates,
    rawStates: data.models,
    nextKey: data.pagination.next_key,
  };
};
