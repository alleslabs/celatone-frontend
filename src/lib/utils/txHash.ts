import type { Option } from "lib/types";

import { CHAIN } from "env";

export const parseTxHash = (txHash: string) =>
  CHAIN === "initia" ? txHash : txHash.substring(2);

export const parseTxHashOpt = (hashOpt: Option<string>): Option<string> =>
  hashOpt ? parseTxHash(hashOpt) : undefined;

export const formatEvmTxHash = (evmTxHash: string) =>
  `0x${evmTxHash.slice(2).toUpperCase()}`;
