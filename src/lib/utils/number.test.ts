import { isPositiveInt } from "./number";

describe("isPositiveInt", () => {
  describe("invalid value", () => {
    test("text string", () => {
      expect(isPositiveInt("text")).toBeFalsy();
    });
    test("special character string", () => {
      expect(isPositiveInt("$#*@")).toBeFalsy();
    });
    test("negative number string", () => {
      expect(isPositiveInt("-1")).toBeFalsy();
    });
    test("decimal number string", () => {
      expect(isPositiveInt("1.11")).toBeFalsy();
    });
    test("negative decimal number string", () => {
      expect(isPositiveInt("-1.11")).toBeFalsy();
    });
    test("empty string", () => {
      expect(isPositiveInt("")).toBeFalsy();
    });
    test("space string", () => {
      expect(isPositiveInt(" ")).toBeFalsy();
    });
    test("0 string", () => {
      expect(isPositiveInt("0")).toBeFalsy();
    });
  });

  describe("positive integer", () => {
    test("integer string", () => {
      expect(isPositiveInt("22")).toBeTruthy();
    });
  });
});
