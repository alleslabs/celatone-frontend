import { logs } from "@cosmjs/stargate";

import type { Option } from "lib/types";

export const findAttr = (
  log: Option<logs.Log>,
  eventType: string,
  attrKey: string
): Option<string> => {
  if (!log) return undefined;
  try {
    return logs.findAttribute([log], eventType, attrKey).value;
  } catch {
    return undefined;
  }
};
