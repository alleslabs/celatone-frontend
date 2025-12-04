import type {
  EvmBalanceChanges,
  MoveBalanceChanges,
  WasmBalanceChanges,
} from "@initia/tx-decoder";
import type { AddressReturnType } from "lib/app-provider";
import type { LinkType } from "lib/components/ExplorerLink";

/**
 * Filters out zero-amount changes from FT balance changes
 */
export const filterNonZeroFtChanges = (
  ftChange: Record<string, string> | undefined
): [string, string][] =>
  Object.entries(ftChange ?? {}).filter(([, amount]) => amount !== "0");

/**
 * Filters out zero-amount changes from object/NFT balance changes
 */
export const filterNonZeroObjectChanges = (
  objectChange: Record<string, string> | undefined
): [string, string][] =>
  Object.entries(objectChange ?? {}).filter(([, amount]) => amount !== "0");

/**
 * Processes NFT changes for EVM balance changes
 * Groups by contract address and filters out zero-amount changes
 */
export const processEvmNftChanges = (
  nftChange: EvmBalanceChanges["nft"][string] | undefined
): [string, [string, string][]][] =>
  Object.entries(nftChange ?? {}).map(([contractAddress, tokenIds]) => {
    const tokenIdChanges = Object.entries(tokenIds).filter(
      ([, amount]) => amount !== "0"
    );
    return [contractAddress, tokenIdChanges] as [string, [string, string][]];
  });

/**
 * Calculates total number of NFT changes across all contracts
 */
export const calculateTotalNftChanges = (
  nftChangeEntries: [string, [string, string][]][]
): number =>
  nftChangeEntries.reduce(
    (acc, [, tokenIdChanges]) => acc + tokenIdChanges.length,
    0
  );

/**
 * Gets all unique addresses from Move balance changes
 */
export const getMoveAddresses = (
  moveBalanceChanges: MoveBalanceChanges
): string[] =>
  Array.from(
    new Set([
      ...Object.keys(moveBalanceChanges.ft),
      ...Object.keys(moveBalanceChanges.object),
    ])
  );

/**
 * Gets all unique addresses from EVM balance changes
 */
export const getEvmAddresses = (
  evmBalanceChanges: EvmBalanceChanges
): string[] =>
  Array.from(
    new Set([
      ...Object.keys(evmBalanceChanges.ft),
      ...Object.keys(evmBalanceChanges.nft),
    ])
  );

/**
 * Determines the appropriate LinkType for an EVM address
 */
export const getEvmAddressType = (): Exclude<
  LinkType,
  "function_name_wasm" | "function_name"
> => "user_address"; // Account detail page will auto redirect to contract page if needed

/**
 * Gets all unique addresses from WASM balance changes
 */
export const getWasmAddresses = (
  wasmBalanceChanges: WasmBalanceChanges
): string[] =>
  Array.from(
    new Set([
      ...Object.keys(wasmBalanceChanges.ft),
      ...Object.keys(wasmBalanceChanges.nft),
    ])
  );

/**
 * Processes NFT changes for WASM balance changes
 * Groups by contract address and filters out zero-amount changes
 */
export const processWasmNftChanges = (
  nftChange: WasmBalanceChanges["nft"][string] | undefined
): [string, [string, string][]][] =>
  Object.entries(nftChange ?? {}).map(([contractAddress, tokenIds]) => {
    const tokenIdChanges = Object.entries(tokenIds).filter(
      ([, amount]) => amount !== "0"
    );
    return [contractAddress, tokenIdChanges] as [string, [string, string][]];
  });

/**
 * Determines the appropriate LinkType for a WASM address
 */
export const getWasmAddressType = (): Exclude<
  LinkType,
  "function_name_wasm" | "function_name"
> => "user_address";

/**
 * Type guard to check if an item has balance changes
 */
export const hasBalanceChanges = <T extends { ftChangeEntries: unknown[] }>(
  item: T | null,
  totalChanges: number
): item is T => item !== null && totalChanges > 0;

export interface MappedBalanceChange {
  address: string;
  addressType: AddressReturnType | Exclude<LinkType, "function_name">;
  ftChangeEntries: [string, string][];
}

export interface MappedMoveBalanceChange extends MappedBalanceChange {
  objectChangeEntries: [string, string][];
}

export interface MappedEvmBalanceChange extends MappedBalanceChange {
  nftChangeEntries: [string, [string, string][]][];
}

export interface MappedWasmBalanceChange extends MappedBalanceChange {
  nftChangeEntries: [string, [string, string][]][];
}
