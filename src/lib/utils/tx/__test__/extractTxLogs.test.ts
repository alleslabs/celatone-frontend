import {
  fromEvents,
  fromEventsTxFailed,
  fromLogs,
  fromLogsTxFailed,
} from "./extractTxLogs.example";
import { extractTxLogs } from "../extractTxLogs";

describe("extractTxLogs", () => {
  test("from logs", () => {
    expect(extractTxLogs(fromLogs.txData)).toEqual(fromLogs.result);
  });
  test("from logs Tx Failed", () => {
    expect(extractTxLogs(fromLogsTxFailed.txData)).toEqual(
      fromLogsTxFailed.result
    );
  });
  test("from events", () => {
    expect(extractTxLogs(fromEvents.txData)).toEqual(fromEvents.result);
  });
  test("from events Tx Failed", () => {
    expect(extractTxLogs(fromEventsTxFailed.txData)).toEqual(
      fromEventsTxFailed.result
    );
  });
});
