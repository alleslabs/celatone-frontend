import { zTxsResponseItemFromRest } from "./tx";

jest.mock("env", () => ({ CHAIN: "initia" }));
jest.mock("lib/utils", () => ({
  extractTxLogs: jest.requireActual("lib/utils/tx/extractTxLogs").extractTxLogs,
  getActionMsgType: jest.requireActual("lib/utils/extractMsgType")
    .getActionMsgType,
  getMsgFurtherAction: jest.requireActual("lib/utils/msgFurtherAction")
    .getMsgFurtherAction,
  getTxBadges: jest.requireActual("lib/utils/tx/badge").getTxBadges,
  parseTxHash: jest.requireActual("lib/utils/txHash").parseTxHash,
  snakeToCamel: jest.requireActual("lib/utils/formatter/snakeToCamel")
    .snakeToCamel,
  toChecksumAddress: jest.requireActual("lib/utils/address").toChecksumAddress,
}));

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
