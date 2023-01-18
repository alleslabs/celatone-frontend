import { useCallback } from "react";

import { useInternalNavigate } from "lib/app-provider";
import type { Msg } from "lib/types";
import { encode, camelToSnake } from "lib/utils";

export const useRedo = () => {
  const navigate = useInternalNavigate();

  return useCallback(
    (
      e: React.MouseEvent<Element, MouseEvent>,
      type: string | undefined,
      msg: Msg,
      chainName: string
    ) => {
      e.stopPropagation();
      if (!type || !msg) return null;
      if (type === "MsgExecuteContract") {
        const encodeMsg = encode(JSON.stringify(camelToSnake(msg.msg)));
        navigate({
          pathname: "/execute",
          query: { chainName, contract: msg.contract, msg: encodeMsg },
        });
      } else if (type === "MsgInstantiateContract") {
        const encodeMsg = encode(JSON.stringify(camelToSnake(msg)));
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
