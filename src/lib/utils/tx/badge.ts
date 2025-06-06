import type { Log } from "@cosmjs/stargate/build/logs";
import type { Option } from "lib/types";

export const getTxBadges = (type: string, log: Option<Log>) => {
  return {
    isEvm: Boolean(type.startsWith("/minievm")),
    isIbc:
      Boolean(log?.events.find((event) => event.type === "send_packet")) ||
      type.startsWith("/ibc"),
    isOpinit: Boolean(type.startsWith("/opinit")),
  };
};
