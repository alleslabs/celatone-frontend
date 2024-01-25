import type { Event, logs } from "@cosmjs/stargate";

import type { TxResponse } from "lib/services/tx";

interface Log extends logs.Log {
  events: Event[];
}

export const extractTxLogs = (txData: TxResponse): logs.Log[] => {
  if (txData.logs.length > 0) return txData.logs;

  const logs: Record<string, Log> = {};
  txData.events.forEach((event) => {
    const index = event.attributes.find(
      (attr) => attr.key === "msg_index"
    )?.value;
    if (index) {
      if (!logs[index])
        logs[index] = {
          msg_index: Number(index),
          log: "",
          events: [],
        };

      logs[index].events.push(event);
    }
  });

  const msgLogs = Object.values(logs);
  msgLogs.sort((a, b) => a.msg_index - b.msg_index);
  return msgLogs;
};
