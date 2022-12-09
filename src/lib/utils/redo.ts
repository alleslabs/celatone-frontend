import router from "next/router";

import type { Msg } from "lib/types";

// TODO - Revisit, got 'Dependency cycle detected'
import { encode } from "./base64";
import { camelToSnake } from "./formatter";

export const onClickRedo = (
  e: React.MouseEvent<Element, MouseEvent>,
  type: string | undefined,
  msg: Msg,
  chainName: string
) => {
  e.stopPropagation();
  if (!type || !msg) return null;
  if (type === "MsgExecuteContract") {
    const encodeMsg = encode(JSON.stringify(camelToSnake(msg.msg)));
    router.push({
      pathname: "/execute",
      query: { chainName, contract: msg.contract, msg: encodeMsg },
    });
  } else if (type === "MsgInstantiateContract") {
    const encodeMsg = encode(JSON.stringify(camelToSnake(msg)));
    router.push({
      pathname: "/instantiate",
      query: { chainName, msg: encodeMsg },
    });
  }
  return null;
};
