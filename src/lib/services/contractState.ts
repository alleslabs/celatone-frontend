import axios from "axios";
import { z } from "zod";

import type { BechAddr32, ContractState, Option } from "lib/types";
import { zPagination } from "lib/types";
import {
  libDecode,
  parseJsonStr,
  parseStateKey,
  parseWithError,
} from "lib/utils";

const zResponseContractState = z.object({
  key: z.string(),
  value: z.string(),
});

const zResponseContractStates = z.object({
  models: zResponseContractState.array(),
  pagination: zPagination,
});

export const getContractStates = async (
  baseEndpoint: string,
  contractAddress: BechAddr32,
  numStatesToLoad: number,
  paginationKey: Option<string>
) => {
  const states = await axios
    .get(`${baseEndpoint}/${contractAddress}/states`, {
      params: {
        limit: numStatesToLoad,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zResponseContractStates, data));

  const parsedStates = states.models.map<ContractState>((model) => ({
    rawKey: model.key,
    key: parseStateKey(model.key),
    value: parseJsonStr(libDecode(model.value)),
  }));

  return {
    states: parsedStates,
    rawStates: states.models,
    nextKey: states.pagination.nextKey,
  };
};
