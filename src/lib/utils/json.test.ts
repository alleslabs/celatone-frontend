import { jsonLineCount, jsonPrettify, jsonValidate } from "./json";

describe("jsonValidate", () => {
  test("empty string", () => {
    expect(jsonValidate("")).toEqual("Can't use empty string");
  });
  test("space string", () => {
    expect(jsonValidate(" ")).toEqual("Can't use empty string");
  });
  test("valid empty json", () => {
    expect(jsonValidate("{}")).toBeNull();
  });
  test("valid json", () => {
    expect(jsonValidate('{"key": "value"}')).toBeNull();
    expect(jsonValidate('{"key": 0}')).toBeNull();
    expect(jsonValidate('{"key": []}')).toBeNull();
    expect(jsonValidate('{"key": {}}')).toBeNull();
    expect(jsonValidate('{"key": null}')).toBeNull();
    expect(jsonValidate('{"key": true}')).toBeNull();
    expect(jsonValidate('{"key": true, "key": true}')).toBeNull();
  });
  test("invalid json", () => {
    expect(jsonValidate("invalid string")).not.toBeNull();
    expect(jsonValidate("{")).not.toBeNull();
    expect(jsonValidate('{"key":}')).not.toBeNull();
    expect(jsonValidate('{"key":x}')).not.toBeNull();
  });
});

describe("jsonPrettify", () => {
  test("non json", () => {
    expect(jsonPrettify("not json")).toEqual("not json");
    expect(jsonPrettify("")).toEqual("");
  });
  test("empty json", () => {
    expect(jsonPrettify("{}")).toEqual("{}");
  });
});

describe("jsonLineCount", () => {
  test("1 line count", () => {
    expect(jsonLineCount("")).toEqual(1);
    expect(jsonLineCount("{}")).toEqual(1);
  });
  test("multiple lines count", () => {
    expect(jsonLineCount("line1 \n line2 \n line3")).toEqual(3);
    expect(jsonLineCount('{"key": "value", \n "key": 1}')).toEqual(2);
  });
});
