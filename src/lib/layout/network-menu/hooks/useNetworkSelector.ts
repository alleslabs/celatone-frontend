/* eslint-disable react-hooks/exhaustive-deps */
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { useChainConfigs } from "lib/app-provider";
import { usePinnedNetworks } from "lib/hooks";
import { isUndefined } from "lodash";
import { useCallback, useMemo, useState } from "react";

import { filterChains, getNextCursor } from "./utils";

export const useNetworkSelector = (onClose: () => void) => {
  const { chainConfigs, supportedChainIds } = useChainConfigs();
  const pinnedNetworks = usePinnedNetworks();

  const [keyword, setKeyword] = useState("");
  const [cursor, setCursor] = useState<number>();

  const [
    filteredPinnedChains,
    filteredMainnetChains,
    filteredTestnetChains,
    filteredDevnetChains,
    filteredLocalChains,
  ] = useMemo(
    () => [
      filterChains(chainConfigs, pinnedNetworks, keyword),
      filterChains(chainConfigs, supportedChainIds, keyword, "mainnet"),
      filterChains(chainConfigs, supportedChainIds, keyword, "testnet"),
      filterChains(chainConfigs, supportedChainIds, keyword, "devnet"),
      filterChains(chainConfigs, supportedChainIds, keyword, "local"),
    ],
    [chainConfigs, JSON.stringify(pinnedNetworks), supportedChainIds, keyword]
  );

  const totalNetworks =
    filteredPinnedChains.length +
    filteredMainnetChains.length +
    filteredTestnetChains.length +
    filteredDevnetChains.length +
    filteredLocalChains.length;

  const handleOnKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!totalNetworks) return;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown": {
          e.preventDefault();
          const nextCursor = getNextCursor(e.key, cursor, totalNetworks - 1);
          const element = document.getElementById(`item-${nextCursor}`);
          setCursor(nextCursor);
          element?.scrollIntoView({ block: "nearest", inline: "center" });
          break;
        }
        case "Enter": {
          e.currentTarget.blur();
          if (isUndefined(cursor)) return;
          const element = document.getElementById(`item-${cursor}`);
          element?.click();
          onClose();
          break;
        }
        default:
          break;
      }
    },
    [cursor, onClose, totalNetworks]
  );

  return {
    cursor,
    filteredDevnetChains,
    filteredLocalChains,
    filteredMainnetChains,
    filteredPinnedChains,
    filteredTestnetChains,
    handleOnKeyDown,
    keyword,
    setCursor,
    setKeyword,
  };
};
