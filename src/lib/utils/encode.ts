import type { EncodeObject } from "@cosmjs/proto-signing";
import type { Msg } from "@initia/initia.js";

export const toEncodeObject = (msgs: Msg[]): EncodeObject[] => {
  return msgs.map((msg) => ({
    typeUrl: msg.toData()["@type"],
    value: msg.toProto(),
  }));
};
