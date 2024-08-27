import { findAttribute } from "@cosmjs/cosmwasm-stargate/build/signingcosmwasmclient";
import type { Event } from "@cosmjs/stargate";

import type { Option } from "lib/types";

export const findAttr = (
  events: readonly Event[] | undefined,
  eventType: string,
  attrKey: string
): Option<string> => {
  if (!events) return undefined;
  try {
    return findAttribute(events, eventType, attrKey).value;
  } catch {
    return undefined;
  }
};
