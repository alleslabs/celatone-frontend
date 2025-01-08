import axios from "axios";

import type { AccountModulesResponse } from "lib/services/types";
import {
  zModuleResponseLcd,
  zModulesResponseLcd,
  zMoveViewJsonResponseLcd,
} from "lib/services/types";
import type { Addr, HexAddr, IndexedModule, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const getModuleByAddressLcd = async (
  endpoint: string,
  address: Addr,
  moduleName: string
): Promise<IndexedModule> =>
  axios
    .get(
      `${endpoint}/initia/move/v1/accounts/${encodeURI(address)}/modules/${encodeURI(moduleName)}`
    )
    .then(({ data }) => parseWithError(zModuleResponseLcd, data).module);

export const getModulesByAddressLcd = async (
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
      .then(({ data }) => parseWithError(zModulesResponseLcd, data));
    result.push(...res.modules);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    items: result.sort((a, b) => a.moduleName.localeCompare(b.moduleName)),
    total: result.length,
  };
};

export const getMoveViewJsonLcd = async (
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
    .then(({ data }) => parseWithError(zMoveViewJsonResponseLcd, data));
