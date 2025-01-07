import { z } from "zod";

import { zHexAddr20 } from "lib/types";

export enum TabIndex {
  Assets = "assets",
  Contract = "contract",
  Overview = "overview",
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

export enum TxsTabIndex {
  Cosmos = "cosmos",
  Evm = "evm",
}
