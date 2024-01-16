import type { Event, logs } from "@cosmjs/stargate";

import type { TxData } from "lib/services/txService";

export const extractTxLogs = (txData: TxData): logs.Log[] => {
  const msgLogs = txData.tx.body.messages.map((_, idx) => ({
    msg_index: idx,
    log: "",
    events: [] as Event[],
  }));

  if (txData.logs.length > 0)
    txData.logs.forEach((log) =>
      msgLogs[log.msg_index].events.concat(...log.events)
    );
  else
    txData.events.forEach((event) => {
      const attribute = event.attributes.find(
        (attr) => attr.key === "msg_index"
      );
      if (attribute) {
        const index = Number(attribute.value);
        msgLogs[index].events.push(event);
      }
    });

  return msgLogs;
};
