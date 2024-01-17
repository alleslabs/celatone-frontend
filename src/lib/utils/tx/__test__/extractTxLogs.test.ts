import { extractTxLogs } from "../extractTxLogs";

import { fromLogs, fromEvents } from "./extractTxLogs.example";

describe("extractTxLogs", () => {
  test("from logs", () => {
    expect(extractTxLogs(fromLogs.txData)).toEqual(fromLogs.result);
  });
  test("from events", () => {
    expect(extractTxLogs(fromEvents.txData)).toEqual(fromEvents.result);
  });
});
