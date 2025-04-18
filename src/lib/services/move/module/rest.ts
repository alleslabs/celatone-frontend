import type { AccountModulesResponse } from "lib/services/types";
import type { Addr, HexAddr, IndexedModule, Nullable } from "lib/types";

import axios from "axios";
import {
  zModuleResponseRest,
  zModulesResponseRest,
  zMoveViewJsonResponseRest,
} from "lib/services/types";
import { parseWithError } from "lib/utils";

export const getModuleByAddressRest = async (
  endpoint: string,
  address: Addr,
  moduleName: string
): Promise<IndexedModule> =>
  axios
    .get(
      `${endpoint}/initia/move/v1/accounts/${encodeURI(address)}/modules/${encodeURI(moduleName)}`
    )
    .then(({ data }) => parseWithError(zModuleResponseRest, data).module);

export const getModulesByAddressRest = async (
  endpoint: string,
  address: Addr
): Promise<AccountModulesResponse> => {
  const result: IndexedModule[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/initia/move/v1/accounts/${encodeURI(address)}/modules`,
        {
          params: {
            "pagination.key": paginationKey,
          },
        }
      )
      .then(({ data }) => parseWithError(zModulesResponseRest, data));
    result.push(...res.modules);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    items: result.sort((a, b) => a.moduleName.localeCompare(b.moduleName)),
    total: result.length,
  };
};

export const getMoveViewJsonRest = async (
  endpoint: string,
  vmAddress: HexAddr,
  moduleName: string,
  functionName: string,
  typeArgs: string[],
  args: string[]
) =>
  axios
    .post(`${endpoint}/initia/move/v1/view/json`, {
      address: vmAddress,
      args,
      function_name: functionName,
      module_name: moduleName,
      type_args: typeArgs,
    })
    .then(({ data }) => parseWithError(zMoveViewJsonResponseRest, data));
