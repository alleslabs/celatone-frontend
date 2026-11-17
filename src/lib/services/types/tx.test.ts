import {
  zTxByHashResponseRest,
  zTxsResponseItemFromRest,
  zTxsResponseWithTxResponse,
} from "./tx";

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

  test.each([
    ["undefined", { tx: undefined }],
    ["missing", {}],
  ])("falls back to placeholder tx when tx is %s", (_, txField) => {
    const result = zTxsResponseItemFromRest.safeParse({
      code: 0,
      codespace: "",
      data: "",
      events: [],
      gas_used: "1",
      gas_wanted: "1",
      height: "1",
      info: "",
      logs: [],
      raw_log: "",
      timestamp: "2026-08-06T00:00:00Z",
      txhash: "A".repeat(64),
      ...txField,
    });

    expect(result.success).toBe(true);
  });
});

describe("zTxByHashResponseRest", () => {
  const tx = {
    auth_info: {
      fee: {
        amount: [{ amount: "1", denom: "uinit" }],
        gas_limit: "100",
        granter: "",
        payer: "",
      },
      signer_infos: [
        {
          mode_info: { single: { mode: "SIGN_MODE_DIRECT" } },
          public_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "Axdt0OtFq4TF/TA4EnlF4J0Lv6E+9jFccR2/ULQVXP2a",
          },
          sequence: "1",
        },
      ],
    },
    body: {
      extension_options: [],
      memo: "",
      messages: [{ "@type": "/cosmos.bank.v1beta1.MsgSend" }],
      non_critical_extension_options: [],
      timeout_height: "0",
    },
    signatures: [],
  };

  test.each([
    ["missing", {}],
    ["null", { tx_response: null }],
  ])("falls back to the top-level tx when tx_response is %s", (_, field) => {
    expect(zTxByHashResponseRest.parse({ tx, ...field })).toMatchObject({
      tx: { authInfo: { fee: { gasLimit: "100" } } },
      txResponse: undefined,
    });
  });

  test("throws when tx and tx_response are both missing", () => {
    expect(() => zTxByHashResponseRest.parse({ tx_response: null })).toThrow();
  });
});

describe("zTxsResponseWithTxResponse", () => {
  test("parses an item whose tx_response is null", () => {
    const result = zTxsResponseWithTxResponse.parse({
      items: [
        {
          created: "2026-08-06T00:00:00Z",
          hash: "A".repeat(64),
          height: 1,
          is_ibc: false,
          is_send: true,
          messages: [],
          sender: "init1sender",
          success: true,
          tx_response: null,
        },
      ],
      total: 1,
    });

    expect(result.items[0].txResponse).toBeUndefined();
    expect(result.items[0].rawTxResponse).toBeUndefined();
  });
});
