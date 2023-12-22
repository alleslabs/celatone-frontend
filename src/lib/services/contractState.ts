import axios from "axios";
import { z } from "zod";

import type { ContractAddr, ContractState } from "lib/types";
import { zPagination } from "lib/types/rest";
import { libDecode, parseJsonStr, parseStateKey } from "lib/utils";

const zResponseContractState = z.object({
  key: z.string(),
  value: z.string(),
});

const zResponseContractStates = z.object({
  models: zResponseContractState.array(),
  pagination: zPagination,
});

type ResponseContractStates = z.infer<typeof zResponseContractStates>;

export const getContractStates = async (
  baseEndpoint: string,
  contractAddress: ContractAddr,
  numStatesToLoad: number,
  paginationKey: string | null
) => {
  const { data } = await axios.get<ResponseContractStates>(
    `${baseEndpoint}/${contractAddress}/states`,
    {
      params: {
        limit: numStatesToLoad,
        pagination_key: paginationKey,
      },
    }
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
