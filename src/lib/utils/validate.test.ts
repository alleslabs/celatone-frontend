/* eslint-disable sonarjs/no-duplicate-string */
import { isHex, isId, isPosDecimal, isTxHash } from "./validate";

describe("isId", () => {
  test("valid", () => {
    expect(isId("1234")).toBeTruthy();
  });
  describe("invalid", () => {
    test("empty string", () => {
      expect(isId("")).toBeFalsy();
    });
    test("non-number string", () => {
      expect(isId("123E")).toBeFalsy();
    });
    test("length too long", () => {
      expect(isId("12345678")).toBeFalsy();
    });
    test("negative number", () => {
      expect(isId("-1234")).toBeFalsy();
    });
    test("hexstring", () => {
      expect(isId("0x1234")).toBeFalsy();
    });
  });
});

describe("isHex", () => {
  test("valid", () => {
    expect(isHex("1234ABCD")).toBeTruthy();
  });
  describe("invalid", () => {
    test("empty string", () => {
      expect(isHex("")).toBeFalsy();
    });
    test("non-hexstring", () => {
      expect(isHex("XYZ")).toBeFalsy();
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
