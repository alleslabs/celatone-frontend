import type { BechAddr32, ContractState, Option } from "lib/types";

import axios from "axios";
import { zResponseContractStates } from "lib/services/types";
import {
  libDecode,
  parseJsonStr,
  parseStateKey,
  parseWithError,
} from "lib/utils";

export const getContractStatesRest = async (
  endpoint: string,
  contractAddress: BechAddr32,
  limit: number,
  paginationKey: Option<string>
) => {
  const states = await axios
    .get(
      `${endpoint}/cosmwasm/wasm/v1/contract/${encodeURI(contractAddress)}/state`,
      {
        params: {
          limit,
          "pagination.key": paginationKey,
        },
      }
    )
    .then(({ data }) => parseWithError(zResponseContractStates, data));

  const parsedStates = states.models.map<ContractState>((model) => ({
    key: parseStateKey(model.key),
    rawKey: model.key,
    value: parseJsonStr(libDecode(model.value)),
  }));

  return {
    nextKey: states.pagination.nextKey,
    rawStates: states.models,
    states: parsedStates,
  };
};
