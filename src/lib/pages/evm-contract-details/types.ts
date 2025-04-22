import { zHexAddr20 } from "lib/types";
import { z } from "zod";

export enum TabIndex {
  Assets = "assets",
  Contract = "contract",
  Overview = "overview",
  ReadWrite = "read-write",
  Transactions = "transactions",
}

export enum InteractTabsIndex {
  Read = "read",
  ReadProxy = "read-proxy",
  Write = "write",
  WriteProxy = "write-proxy",
}

export enum EvmContractDetailsContractInfoTabs {
  Abi = "ABI",
  ByteCode = "ByteCode",
  Code = "Code",
  Compiler = "Compiler",
}

export const zEvmContractDetailsQueryParams = z.object({
  contractAddress: zHexAddr20,
  selectedFn: z.string().optional(),
  selectedType: z.union([
    z.nativeEnum(InteractTabsIndex),
    z
      .string()
      .optional()
      .transform(() => InteractTabsIndex.Read),
  ]),
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
