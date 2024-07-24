import type { ChainConfig } from "config/chain";
import { CHAIN_CONFIGS } from "config/chain";
import type { Option } from "lib/types";

export const getNextCursor = (
  key: string,
  current: Option<number>,
  lastIndex: number
) => {
  switch (key) {
    case "ArrowUp":
      if (current === undefined) return lastIndex;
      return current <= 0 ? lastIndex : current - 1;
    case "ArrowDown":
      if (current === undefined) return 0;
      return current >= lastIndex ? 0 : current + 1;
    default:
      return undefined;
  }
};

export const filterChains = (
  chainIds: string[],
  keyword: string,
  type?: ChainConfig["networkType"]
) => {
  const chainIdsByType = type
    ? chainIds.filter((chainId) => CHAIN_CONFIGS[chainId]?.networkType === type)
    : chainIds;

  return chainIdsByType.filter(
    (chainId) =>
      !keyword ||
      CHAIN_CONFIGS[chainId]?.prettyName
        .toLowerCase()
        .includes(keyword.toLowerCase()) ||
      chainId.toLowerCase().includes(keyword.toLowerCase())
  );
};
