import { zBechAddr32 } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Assets = "assets",
  Delegations = "delegations",
  Overview = "overview",
  States = "states",
  TxsHistories = "txs-histories",
}

export const zContractDetailsQueryParams = z.object({
  contractAddress: zBechAddr32,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
