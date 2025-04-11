import { zHexAddr20 } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Overview = "overview",
  Contract = "contract",
  ReadWrite = "read-write",
  Assets = "assets",
  Transactions = "transactions",
}

export enum InteractTabsIndex {
  Read = "read",
  Write = "write",
  ReadProxy = "read-proxy",
  WriteProxy = "write-proxy",
}

export enum EvmContractDetailsContractInfoTabs {
  Code = "Code",
  Compiler = "Compiler",
  Abi = "ABI",
  ByteCode = "ByteCode",
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
