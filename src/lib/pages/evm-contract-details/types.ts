import { z } from "zod";

import { zHexAddr20 } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Contract = "contract",
  Assets = "assets",
  Transactions = "transactions",
}

export enum EvmContractDetailsContractTabs {
  Code = "code",
  Compiler = "compiler",
  Abi = "abi",
  ByteCode = "byteCode",
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
