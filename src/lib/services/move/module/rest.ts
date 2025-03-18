import axios from "axios";

import type { AccountModulesResponse } from "lib/services/types";
import {
  zModuleResponseRest,
  zModulesResponseRest,
  zMoveViewJsonResponseRest,
} from "lib/services/types";
import type { Addr, HexAddr, IndexedModule, Nullable } from "lib/types";
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
      module_name: moduleName,
      function_name: functionName,
      type_args: typeArgs,
      args,
    })
    .then(({ data }) => parseWithError(zMoveViewJsonResponseRest, data));
