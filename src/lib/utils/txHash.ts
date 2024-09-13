import type { Option } from "lib/types";

export const parseTxHash = (txHash: string) => txHash.substring(2);

export const parseTxHashOpt = (hashOpt: Option<string>): Option<string> =>
  hashOpt ? parseTxHash(hashOpt) : undefined;

export const formatEvmTxHash = (evmTxHash: string) =>
  `0x${evmTxHash.slice(2).toUpperCase()}`;
