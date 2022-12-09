import { typeUrlDict } from "lib/data";
import type { ComposedMsg, TxMessage, MsgType } from "lib/types";

export const composeMsg = (msgType: MsgType, msg: TxMessage): ComposedMsg => {
  const typeUrl = typeUrlDict[msgType];
  return {
    typeUrl,
    value: msg,
  };
};
