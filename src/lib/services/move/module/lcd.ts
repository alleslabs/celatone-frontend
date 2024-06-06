import axios from "axios";

import {
  zModuleLcdReturn,
  zModulesLcdReturn,
  zTxsByAddressResponseLcd,
} from "lib/services/types";
import type { Addr, IndexedModule, Nullable } from "lib/types";
import { parseWithError } from "lib/utils";

export const getModuleByAddressLcd = async (
  endpoint: string,
  vmAddress: Addr,
  moduleName: string
): Promise<IndexedModule> =>
  axios
    .get(
      `${endpoint}/initia/move/v1/accounts/${encodeURIComponent(vmAddress)}/modules/${encodeURIComponent(moduleName)}`
    )
    .then(({ data }) => parseWithError(zModuleLcdReturn, data).module);

export const getModulesByAddressLcd = async (
  endpoint: string,
  vmAddress: Addr
): Promise<{ items: IndexedModule[] }> => {
  const result: IndexedModule[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/initia/move/v1/accounts/${encodeURI(vmAddress)}/modules`,
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

export const getModuleTxsLcd = async (
  endpoint: string,
  vmAddress: Addr,
  moduleName: string,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/cosmos/tx/v1beta1/txs`, {
      params: {
        query: `execute.module_addr='${vmAddress}' AND execute.module_name='${moduleName}'`,
        order_by: 2,
        page: offset,
        limit,
      },
    })
    .then(({ data }) => parseWithError(zTxsByAddressResponseLcd, data));
