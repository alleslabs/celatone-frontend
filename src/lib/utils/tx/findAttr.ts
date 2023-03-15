import type { Log } from "@cosmjs/stargate/build/logs";
import { findAttribute } from "@cosmjs/stargate/build/logs";

import type { Option } from "lib/types";

export const findAttr = (
  log: Option<Log>,
  eventType: string,
  attrKey: string
): Option<string> => {
  if (!log) return undefined;
  try {
    return findAttribute([log], eventType, attrKey).value;
  } catch {
    return undefined;
  }
};
