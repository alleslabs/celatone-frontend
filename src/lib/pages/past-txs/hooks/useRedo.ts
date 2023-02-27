import { useCallback } from "react";

import { useInternalNavigate } from "lib/app-provider";
import type { Msg, Option } from "lib/types";
import { libEncode, camelToSnake } from "lib/utils";

export const useRedo = () => {
  const navigate = useInternalNavigate();

  return useCallback(
    (
      e: React.MouseEvent<Element, MouseEvent>,
      type: Option<string>,
      msg: Msg,
      chainName: string
    ) => {
      e.stopPropagation();
      if (!type || !msg) return null;
      if (type === "MsgExecuteContract") {
        const encodeMsg = libEncode(JSON.stringify(camelToSnake(msg)));
        navigate({
          pathname: "/execute",
          query: { chainName, contract: msg.contract, msg: encodeMsg },
        });
      } else if (
        type === "MsgInstantiateContract" ||
        type === "MsgInstantiateContract2"
      ) {
        const encodeMsg = libEncode(JSON.stringify(camelToSnake(msg)));
        navigate({
          pathname: "/instantiate",
          query: { chainName, msg: encodeMsg },
        });
      }
      return null;
    },
    [navigate]
  );
};
