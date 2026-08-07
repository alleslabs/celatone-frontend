import { zTxsResponseItemFromRest } from "./tx";

jest.mock("env", () => ({ CHAIN: "initia" }));

describe("zTxsResponseItemFromRest", () => {
  test("parses the raw response once and reuses the derived transaction data", () => {
    const result = zTxsResponseItemFromRest.parse({
      code: 0,
      codespace: "",
      data: "",
      events: [
        {
          attributes: [{ key: "sender", value: "init1sender" }],
          type: "message",
        },
      ],
      gas_used: "1",
      gas_wanted: "1",
      height: "1",
      info: "",
      logs: [],
      raw_log: "",
      timestamp: "2026-08-06T00:00:00Z",
      tx: null,
      txhash: "A".repeat(64),
    });

    if (!result.rawTxResponse || !result.txResponse) {
      throw new Error("Expected the parsed transaction responses");
    }

    expect(result.item.hash).toBe(result.rawTxResponse.txhash);
    expect(result.item.events).toBe(result.txResponse.events);
    expect(result.item.created).toBe(result.txResponse.timestamp);
  });
});
