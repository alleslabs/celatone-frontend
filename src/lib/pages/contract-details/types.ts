import { z } from "zod";

import { zContractAddr } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Assets = "assets",
  TxsHistories = "txs-histories",
  States = "states",
}

export const zContractDetailsQueryParams = z.object({
  contractAddress: zContractAddr,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
