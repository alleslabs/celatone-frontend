import { isUndefined } from "lodash";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useMemo, useState } from "react";

import { useCelatoneApp } from "lib/app-provider";
import { useNetworkStore } from "lib/providers/store";

import { filterChains, getNextCursor } from "./utils";

export const useNetworkSelector = (onClose: () => void) => {
  const { availableChainIds } = useCelatoneApp();
  const { getPinnedNetworks } = useNetworkStore();

  const [keyword, setKeyword] = useState("");
  const [cursor, setCursor] = useState<number>();

  const pinnedNetworks = getPinnedNetworks();
  const [filteredPinnedChains, filteredMainnetChains, filteredTestnetChains] =
    useMemo(
      () => [
        filterChains(pinnedNetworks, keyword),
        filterChains(availableChainIds, keyword, "mainnet"),
        filterChains(availableChainIds, keyword, "testnet"),
      ],
      [availableChainIds, keyword, pinnedNetworks]
    );

  const totalNetworks =
    filteredPinnedChains.length +
    filteredMainnetChains.length +
    filteredTestnetChains.length;

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
    keyword,
    setKeyword,
    handleOnKeyDown,
    cursor,
    setCursor,
    filteredPinnedChains,
    filteredMainnetChains,
    filteredTestnetChains,
  };
};
