import { isNumeric, isPositiveInt } from "./number";

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
    test("text string with number", () => {
      expect(isPositiveInt("34s")).toBeFalsy();
    });
  });

  describe("positive integer", () => {
    test("integer string", () => {
      expect(isPositiveInt("22")).toBeTruthy();
    });
  });
});

describe("isNumeric", () => {
  describe("invalid value", () => {
    test("empty string", () => {
      expect(isNumeric("")).toBeFalsy();
    });
    test("space string", () => {
      expect(isNumeric(" ")).toBeFalsy();
    });
    test("text string", () => {
      expect(isNumeric("text")).toBeFalsy();
    });
    test("special character string", () => {
      expect(isNumeric("$#*@")).toBeFalsy();
    });
    test("text string with number", () => {
      expect(isNumeric("34s")).toBeFalsy();
    });
  });

  describe("numeric value", () => {
    test("integer string", () => {
      expect(isNumeric("22")).toBeTruthy();
    });
    test("negative integer string", () => {
      expect(isNumeric("-22")).toBeTruthy();
    });
    test("zero string", () => {
      expect(isNumeric("0")).toBeTruthy();
    });
    test("decimal string", () => {
      expect(isNumeric("22.22")).toBeTruthy();
    });
    test("negative decimal string", () => {
      expect(isNumeric("-22.22")).toBeTruthy();
    });
  });
});
