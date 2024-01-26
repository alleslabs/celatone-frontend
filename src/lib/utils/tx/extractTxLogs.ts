import type { Event, logs } from "@cosmjs/stargate";

import type { TxResponse } from "lib/services/tx";

export const extractTxLogs = (txData: TxResponse): logs.Log[] => {
  // Failed Tx - no logs
  if (txData.code !== 0) return [];

  // pre Cosmos SDK 0.50
  if (txData.logs.length > 0) return txData.logs;

  // post Cosmos SDK 0.50
  const msgLogs = txData.tx.body.messages.map((_, index) => ({
    msg_index: index,
    log: "",
    events: [] as Event[],
  }));
  txData.events.forEach((event) => {
    const index = event.attributes.find(
      (attr) => attr.key === "msg_index"
    )?.value;
    if (index) msgLogs[Number(index)].events.push(event);
  });
  return msgLogs;
};
