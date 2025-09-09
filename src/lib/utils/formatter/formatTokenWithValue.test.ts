import type { Token, TokenWithValue, U } from "lib/types";

import { big } from "lib/types";

import {
  formatTokenWithValue,
  formatTokenWithValueList,
} from "./formatTokenWithValue";

describe("formatTokenWithValue", () => {
  test("coin only", () => {
    const token: TokenWithValue = {
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      isLPToken: false,
      logo: undefined,
      precision: undefined,
      price: undefined,
      symbol: undefined,
      value: undefined,
    };

    expect(formatTokenWithValue({ token })).toBe("1,000,000 denom");
    expect(formatTokenWithValue({ decimalPoints: 2, token })).toBe(
      "1,000,000.00 denom"
    );
  });

  test("coin with precision", () => {
    const token: TokenWithValue = {
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      isLPToken: false,
      logo: undefined,
      precision: 6,
      price: undefined,
      symbol: undefined,
      value: undefined,
    };

    expect(formatTokenWithValue({ token })).toBe("1.000000 denom");
    expect(formatTokenWithValue({ decimalPoints: 2, token })).toBe(
      "1.00 denom"
    );
  });

  test("coin with symbol", () => {
    const token: TokenWithValue = {
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      isLPToken: false,
      logo: undefined,
      precision: undefined,
      price: undefined,
      symbol: "CLTN",
      value: undefined,
    };

    expect(formatTokenWithValue({ token })).toBe("1,000,000 CLTN");
    expect(formatTokenWithValue({ decimalPoints: 2, token })).toBe(
      "1,000,000.00 CLTN"
    );
  });

  test("coin with precision and symbol", () => {
    const token: TokenWithValue = {
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      isLPToken: false,
      logo: undefined,
      precision: 6,
      price: undefined,
      symbol: "CLTN",
      value: undefined,
    };

    expect(formatTokenWithValue({ token })).toBe("1.000000 CLTN");
    expect(formatTokenWithValue({ decimalPoints: 2, token })).toBe("1.00 CLTN");
  });
});

describe("formatTokenWithValueList", () => {
  const tokens: TokenWithValue[] = [
    {
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom1",
      isLPToken: false,
      logo: undefined,
      precision: 6,
      price: undefined,
      symbol: "CLTN1",
      value: undefined,
    },
    {
      amount: big(2000000) as U<Token<Big>>,
      denom: "denom2",
      isLPToken: false,
      logo: undefined,
      precision: 6,
      price: undefined,
      symbol: "CLTN2",
      value: undefined,
    },
    {
      amount: big(3000000) as U<Token<Big>>,
      denom: "denom3",
      isLPToken: false,
      logo: undefined,
      precision: 6,
      price: undefined,
      symbol: "CLTN3",
      value: undefined,
    },
  ];

  test("empty array", () => {
    expect(formatTokenWithValueList([])).toBe("");
  });

  test("1 token", () => {
    expect(formatTokenWithValueList(tokens.slice(0, 1))).toBe("1.00 CLTN1");
  });

  test("2 tokens", () => {
    expect(formatTokenWithValueList(tokens.slice(0, 2))).toBe(
      "1.00 CLTN1 and 2.00 CLTN2"
    );
  });

  test("more than 2 tokens", () => {
    expect(formatTokenWithValueList(tokens)).toBe(
      "1.00 CLTN1, 2.00 CLTN2, and 3.00 CLTN3"
    );
  });
});
