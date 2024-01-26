import { hexToString, parseStateKey } from "./contractState";

describe("hexToString", () => {
  it("should convert hex to string", () => {
    expect(hexToString("68656c6c6f20776f726c64")).toEqual("hello world");
  });
});

describe("parseStateKey", () => {
  it("should parse a singleton key", () => {
    const key = "68656c6c6f"; // "hello"
    expect(parseStateKey(key)).toEqual({ type: "singleton", value: "hello" });
  });

  it("should parse a bucket key with multiple values", () => {
    const key = "000568656c6c6f0005776f726c64666f6f626172";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: ["hello", "world", "foobar"],
    });
  });

  it("should parse a bucket key with un-decodable value", () => {
    const key =
      "0005766F7465730008000000000000001C6F736D6F313866736563706D713574757135396B33657A6B72726474366779767233306C78637430616564";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: [
        "votes",
        "000000000000001C",
        "osmo18fsecpmq5tuq59k3ezkrrdt6gyvr30lxct0aed",
      ],
    });
  });

  it("should parse a bucket key with object value", () => {
    const key =
      "0005636F6C6C7300427B2261646472223A226F736D6F31303263796B6C396E67366D39653779746B75323572363332736866646B337578346561797A34222C226163635F6964223A22227D756F736D6F";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: [
        "colls",
        '{"addr":"osmo102cykl9ng6m9e7ytku25r632shfdk3ux4eayz4","acc_id":""}',
        "uosmo",
      ],
    });
  });

  it("should parse a bucket key with tuple value", () => {
    const key =
      "0005636F6C6C73001328226173646B617364222C2268656C6C6F22296962632F32373339344642303932443245434344353631323343373446333645344331463932363030314345414441394341393745413632324232354634314535454232";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: [
        "colls",
        '("asdkasd","hello")',
        "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
      ],
    });
  });

  it("should parse a bucket key with array of object value", () => {
    const key =
      "0005636F6C6C7300445B7B2261646472223A226F736D6F313033687930766B7876667964756E777536683761613230706D787830667A6A776E3639357A6B222C226163635F6964223A22227D5D6962632F32373339344642303932443245434344353631323343373446333645344331463932363030314345414441394341393745413632324232354634314535454232";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: [
        "colls",
        '[{"addr":"osmo103hy0vkxvfydunwu6h7aa20pmxx0fzjwn695zk","acc_id":""}]',
        "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
      ],
    });
  });

  it("should parse a bucket key with hex ending", () => {
    const key = "000970726F706F73616C730000000000000031";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: ["proposals", "0000000000000031"],
    });
  });

  it("should parse base64 key", () => {
    const key = "SGVsbG8="; // "Hello"
    expect(parseStateKey(key)).toEqual({ type: "singleton", value: "Hello" });
  });

  it("should parse base64 key with multiple values", () => {
    const key =
      "AAdhdWN0aW9uc2VpMTJuZTdxdG1kd2QwajAzdDl0NWVzOG1kNjZ3cTRlNXhnOW5lbGFkcnNhZzhmeDN5ODlyY3M1bTJ4YWpDOTgxWjhvUVZUZXBPSzRQclN1c2VpMXhzZjA4bGtoNzBjeW10aGY0Z2h4YWVmODR3NHVsZTd5bnFucXJr==";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: [
        "auction",
        "sei12ne7qtmdwd0j03t9t5es8md66wq4e5xg9neladrsag8fx3y89rcs5m2xajC981Z8oQVTepOK4PrSusei1xsf08lkh70cymthf4ghxaef84w4ule7ynqnqrk",
      ],
    });
  });

  it("should parse base64 key name length less than 4", () => {
    const key = "AAZ0b2tlbnMx"; // 0006746f6b656e7331
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: ["tokens", "1"],
    });
  });
});
