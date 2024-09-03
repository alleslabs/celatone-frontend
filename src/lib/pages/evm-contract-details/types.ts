import { z } from "zod";

import { zHexAddr20 } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Contract = "contract",
  Assets = "assets",
  Transactions = "transactions",
}

export const zEvmContractDetailsQueryParams = z.object({
  contractAddress: zHexAddr20,
  tab: z.union([
    z.nativeEnum(TabIndex),
    z
      .string()
      .optional()
      .transform(() => TabIndex.Overview),
  ]),
});
