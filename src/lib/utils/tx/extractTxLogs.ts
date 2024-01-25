import type { Event, logs } from "@cosmjs/stargate";

import type { TxResponse } from "lib/services/tx";

export const extractTxLogs = (txData: TxResponse): logs.Log[] => {
  if (txData.logs.length > 0) return txData.logs;

  const logs: Record<string, logs.Log & { events: Event[] }> = {};
  txData.events.forEach((event) => {
    const attribute = event.attributes.find((attr) => attr.key === "msg_index");
    if (attribute) {
      const index = attribute.value;
      if (!Object.keys(logs).includes(attribute.value)) {
        logs[index] = {
          msg_index: Number(index),
          log: "",
          events: [] as Event[],
        };
      }
      logs[index].events.push(event);
    }
  });

  return Object.values(logs).toSorted((a, b) => a.msg_index - b.msg_index);
};
