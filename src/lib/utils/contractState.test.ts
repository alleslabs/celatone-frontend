import { hexToString, parseStateKey, parseStateValue } from "./contractState";

describe("hexToString", () => {
  it("should convert hex to string", () => {
    expect(hexToString("68656c6c6f20776f726c64")).toEqual("hello world");
  });
});

describe("parseStateValue", () => {
  it("should parse base64 encoded JSON", () => {
    const value = "eyJmb28iOiJiYXIifQ=="; // {"foo":"bar"}
    expect(parseStateValue(value)).toEqual({ foo: "bar" });
  });

  it("should return the original value if it's not JSON", () => {
    const value = "not json";
    expect(parseStateValue(value)).toEqual(value);
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

  it("should parse a bucket key with hex ending", () => {
    const key = "000970726F706F73616C730000000000000031";
    expect(parseStateKey(key)).toEqual({
      type: "bucket",
      values: ["proposals", "0000000000000031"],
    });
  });

  it("should return a singleton key if parsing fails", () => {
    const key = "not hex";
    expect(parseStateKey(key)).toEqual({ type: "singleton", value: key });
  });
});
