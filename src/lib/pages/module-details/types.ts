import { z } from "zod";

import { zAddr } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Function = "function",
  TxsHistories = "txs-histories",
  Structs = "structs",
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
});

export type ModuleDetailsQueryParams = z.infer<
  typeof zModuleDetailsQueryParams
>;
