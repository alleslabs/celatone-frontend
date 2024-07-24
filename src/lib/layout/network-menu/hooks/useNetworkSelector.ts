import { isUndefined } from "lodash";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useState } from "react";

import type { Option } from "lib/types";

const getNextCursor = (
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

export const useNetworkSelector = (onClose: () => void) => {
  const [keyword, setKeyword] = useState("");
  const [cursor, setCursor] = useState<number>();
  const [networks, setNetworks] = useState<string[]>([]);

  const handleOnKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!networks.length) return;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown": {
          e.preventDefault();
          const nextCursor = getNextCursor(e.key, cursor, networks.length - 1);
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
    [networks, cursor, onClose]
  );

  return {
    keyword,
    setKeyword,
    handleOnKeyDown,
    networks,
    setNetworks,
    cursor,
    setCursor,
  };
};
