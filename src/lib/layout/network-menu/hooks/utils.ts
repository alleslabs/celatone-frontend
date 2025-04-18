import type { ChainConfig } from "@alleslabs/shared";
import type { Option } from "lib/types";

export const filterChains = (
  chainConfigs: { [chainId: string]: ChainConfig },
  chainIds: string[],
  keyword: string,
  type?: ChainConfig["network_type"]
) => {
  const chainIdsByType = type
    ? chainIds.filter((chainId) => chainConfigs[chainId]?.network_type === type)
    : chainIds;

  return chainIdsByType.filter(
    (chainId) =>
      !keyword ||
      chainConfigs[chainId]?.prettyName
        .toLowerCase()
        .includes(keyword.toLowerCase()) ||
      chainId.toLowerCase().includes(keyword.toLowerCase())
  );
};

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
