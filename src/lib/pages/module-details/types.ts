import { z } from "zod";

import { zAddr } from "lib/types";

export enum FunctionTypeTabIndex {
  ALL = "All",
  EXECUTE = "Execute",
  VIEW = "View",
}

export enum TabIndex {
  Function = "function",
  Overview = "overview",
  Structs = "structs",
  TxsHistories = "txs-histories",
}

export const zModuleDetailsQueryParams = z.object({
  address: zAddr,
  moduleName: z.string(),
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
  type: z.union([
    z.nativeEnum(FunctionTypeTabIndex),
    z
      .string()
      .optional()
      .transform(() => FunctionTypeTabIndex.ALL),
  ]),
});

export type ModuleDetailsQueryParams = z.infer<
  typeof zModuleDetailsQueryParams
>;
