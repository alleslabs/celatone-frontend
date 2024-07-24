import { isUndefined } from "lodash";
import { useCallback, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { getNextCursor } from "../utils";
import { useSelectChain } from "lib/app-provider";

export const useNetworkSelector = (onClose: () => void) => {
  const [keyword, setKeyword] = useState("");
  const [cursor, setCursor] = useState<number>();
  const [networks, setNetworks] = useState<string[]>([]);
  const selectChain = useSelectChain();

  const handleOnKeyEnter = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!networks.length) return;
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown": {
          e.preventDefault();
          const element = document.getElementById(`item-${cursor ?? 0}`);
          if (!element) return;
          setCursor((cur) => getNextCursor(e.key, cur, networks.length - 1));
          element.scrollIntoView({ block: "nearest", inline: "center" });
          break;
        }
        case "Enter": {
          e.currentTarget.blur();
          if (isUndefined(cursor)) return;
          const selectedNetwork = networks[cursor].toString();
          selectChain(selectedNetwork);
          onClose();
          break;
        }
        default:
          break;
      }
    },
    [networks, cursor, selectChain, onClose]
  );

  return {
    keyword,
    setKeyword,
    handleOnKeyEnter,
    networks,
    setNetworks,
    cursor,
    setCursor,
  };
};
