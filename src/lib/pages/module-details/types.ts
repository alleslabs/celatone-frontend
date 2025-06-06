import { zAddr } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Function = "function",
  TxsHistories = "txs-histories",
  Structs = "structs",
}

export enum FunctionTypeTabIndex {
  ALL = "All",
  VIEW = "View",
  EXECUTE = "Execute",
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
