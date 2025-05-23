import { zBechAddr32 } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  Delegations = "delegations",
  TxsHistories = "txs-histories",
  States = "states",
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
