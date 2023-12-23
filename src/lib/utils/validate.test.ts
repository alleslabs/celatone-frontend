/* eslint-disable sonarjs/no-duplicate-string */
import { isCodeId, isTxHash, isPosDecimal } from "./validate";

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
    test("negative number", () => {
      expect(isCodeId("-1234")).toBeFalsy();
    });
    test("hexstring", () => {
      expect(isCodeId("0x1234")).toBeFalsy();
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
    test("empty string", () => {
      expect(isTxHash("")).toBeFalsy();
    });
    test("non-hexstring", () => {
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

describe("isPosDecimal", () => {
  test("valid", () => {
    expect(isPosDecimal("12345678")).toBeTruthy();
  });
  describe("invalid", () => {
    test("empty string", () => {
      expect(isPosDecimal("")).toBeFalsy();
    });
    test("non-number string", () => {
      expect(isPosDecimal("1234ABCD")).toBeFalsy();
    });
    test("negative number", () => {
      expect(isPosDecimal("-1234")).toBeFalsy();
    });
    test("hexstring", () => {
      expect(isPosDecimal("0x1234")).toBeFalsy();
    });
  });
});
