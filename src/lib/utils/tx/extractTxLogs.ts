import type { Event, Log, TxResponse } from "lib/services/types";

export const extractTxLogs = (txData: TxResponse): Log[] => {
  // Failed Tx - no logs
  if (txData.code !== 0) return [];

  // pre Cosmos SDK 0.50
  if (txData.logs.length > 0) return txData.logs;

  // post Cosmos SDK 0.50
  const msgLogs =
    txData.tx.body.messages?.map((_, index) => ({
      msgIndex: index,
      log: "",
      events: [] as Event[],
    })) || [];

  txData.events.forEach((event) => {
    const index = event.attributes.find(
      (attr) => attr.key === "msg_index"
    )?.value;

    if (index) msgLogs[Number(index)].events.push(event);
  });

  return msgLogs;
};
