import { typeUrlDict } from "lib/data";
import type { ComposedMsg, TxMessage, AccessType, Addr } from "lib/types";
import { MsgType } from "lib/types";

export const composeMsg = (msgType: MsgType, msg: TxMessage): ComposedMsg => {
  const typeUrl = typeUrlDict[msgType];
  return {
    typeUrl,
    value: msg,
  };
};

interface StoreCodeMsgArgs {
  sender: Addr;
  wasmByteCode: Uint8Array;
  permission: AccessType;
  addresses: Addr[];
}

export const composeStoreCodeMsg = ({
  sender,
  wasmByteCode,
  permission,
  addresses,
}: StoreCodeMsgArgs) =>
  composeMsg(MsgType.STORE_CODE, {
    sender,
    wasmByteCode,
    instantiatePermission: {
      permission,
      addresses,
    },
  });
