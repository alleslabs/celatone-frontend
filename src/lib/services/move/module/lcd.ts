import axios from "axios";

import { zModuleLcdReturn, zModulesLcdReturn } from "lib/services/types";
import type { Addr, IndexedModule, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const getModuleByAddressLcd = async (
  baseEndpoint: string,
  address: Addr,
  moduleName: string
): Promise<IndexedModule> =>
  axios
    .get(
      `${baseEndpoint}/initia/move/v1/accounts/${encodeURIComponent(address)}/modules/${encodeURIComponent(moduleName)}`
    )
    .then(({ data }) => parseWithError(zModuleLcdReturn, data).module);

export const getModulesByAddressLcd = async (
  endpoint: string,
  address: Addr
): Promise<{ items: IndexedModule[] }> => {
  const result: IndexedModule[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/initia/move/v1/accounts/${encodeURI(address)}/modules`,
        {
          params: {
            "pagination.key": paginationKey ?? "",
          },
        }
      )
      .then(({ data }) => parseWithError(zModulesLcdReturn, data));
    result.push(...res.modules);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return {
    items: result.sort((a, b) => a.moduleName.localeCompare(b.moduleName)),
  };
};

// export const getModuleTxsLcd = async (endpoint: string) =>
//   axios.get(`${endpoint}`);
