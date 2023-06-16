import { isCodeId, isTxHash, isBlock } from "./validate";

describe("isCodeId", () => {
  test("valid", () => {
    expect(isCodeId("1234")).toBeTruthy();
  });
  test("invalid number string", () => {
    expect(isCodeId("123E")).toBeFalsy();
  });
  test("invalid length", () => {
    expect(isCodeId("12345678")).toBeFalsy();
  });
});

describe("isTxHash", () => {
  test("valid", () => {
    expect(
      isTxHash(
        "DE7C3F5D7C223257877BCF145452D8B5D45BFD55620B14EE97E6C86EDE16BFE7"
      )
    ).toBeTruthy();
  });
  test("invalid hex", () => {
    expect(
      isTxHash(
        "GE7C3F5D7C223257877BCF145452D8B5D45BFD55620B14EE97E6C86EDE16BFE7"
      )
    ).toBeFalsy();
  });
  test("invalid length", () => {
    expect(isTxHash("DE7C3F5D7C223257877BCF145452D8B5")).toBeFalsy();
  });
});

describe("isBlock", () => {
  test("valid", () => {
    expect(isBlock("12345678")).toBeTruthy();
  });
  test("invalid number string", () => {
    expect(isCodeId("1234ABCD")).toBeFalsy();
  });
});
