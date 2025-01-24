import { z } from "zod";

import { zHexAddr20 } from "lib/types";

export enum TabIndex {
  Overview = "overview",
  Contract = "contract",
  Assets = "assets",
  Transactions = "transactions",
}

export enum InteractTabsIndex {
  Read = "read",
  Write = "write",
  ReadProxy = "read-proxy",
  WriteProxy = "write-proxy",
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
  selectedType: z.union([
    z.nativeEnum(InteractTabsIndex),
    z
      .string()
      .optional()
      .transform(() => InteractTabsIndex.Read),
  ]),
  selectedFn: z.string().optional(),
});

export enum TxsTabIndex {
  Cosmos = "cosmos",
  Evm = "evm",
}
