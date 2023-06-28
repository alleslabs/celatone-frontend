import { isCodeId, isTxHash, isBlock } from "./validate";

describe("isCodeId", () => {
  test("valid", () => {
    expect(isCodeId("1234")).toBeTruthy();
  });
  describe("invalid", () => {
    test("empty string", () => {
      expect(isCodeId("")).toBeFalsy();
    });
    test("non-number string", () => {
      expect(isCodeId("123E")).toBeFalsy();
    });
    test("length too long", () => {
      expect(isCodeId("12345678")).toBeFalsy();
    });
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
  describe("invalid", () => {
    test("empty", () => {
      expect(isTxHash("")).toBeFalsy();
    });
    test("hex", () => {
      expect(
        isTxHash(
          "GE7C3F5D7C223257877BCF145452D8B5D45BFD55620B14EE97E6C86EDE16BFE7"
        )
      ).toBeFalsy();
    });
    test("incorrect length", () => {
      expect(isTxHash("DE7C3F5D7C223257877BCF145452D8B5")).toBeFalsy();
    });
  });
});

describe("isBlock", () => {
  test("valid", () => {
    expect(isBlock("12345678")).toBeTruthy();
  });
  describe("invalid", () => {
    test("empty string", () => {
      expect(isCodeId("1234ABCD")).toBeFalsy();
    });
    test("non-number string", () => {
      expect(isCodeId("1234ABCD")).toBeFalsy();
    });
  });
});
