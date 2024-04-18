import { big } from "lib/types";
import type { Token, TokenWithValue, U } from "lib/types";

import {
  formatTokenWithValue,
  formatTokenWithValueList,
} from "./formatTokenWithValue";

describe("formatTokenWithValue", () => {
  test("coin only", () => {
    const token: TokenWithValue = {
      isLPToken: false,
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      symbol: undefined,
      precision: undefined,
      price: undefined,
      value: undefined,
      logo: undefined,
    };

    expect(formatTokenWithValue(token)).toBe("1,000,000 denom");
    expect(formatTokenWithValue(token, 2)).toBe("1,000,000.00 denom");
  });

  test("coin with precision", () => {
    const token: TokenWithValue = {
      isLPToken: false,
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      symbol: undefined,
      precision: 6,
      price: undefined,
      value: undefined,
      logo: undefined,
    };

    expect(formatTokenWithValue(token)).toBe("1.000000 denom");
    expect(formatTokenWithValue(token, 2)).toBe("1.00 denom");
  });

  test("coin with symbol", () => {
    const token: TokenWithValue = {
      isLPToken: false,
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      symbol: "CLTN",
      precision: undefined,
      price: undefined,
      value: undefined,
      logo: undefined,
    };

    expect(formatTokenWithValue(token)).toBe("1,000,000 CLTN");
    expect(formatTokenWithValue(token, 2)).toBe("1,000,000.00 CLTN");
  });

  test("coin with precision and symbol", () => {
    const token: TokenWithValue = {
      isLPToken: false,
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom",
      symbol: "CLTN",
      precision: 6,
      price: undefined,
      value: undefined,
      logo: undefined,
    };

    expect(formatTokenWithValue(token)).toBe("1.000000 CLTN");
    expect(formatTokenWithValue(token, 2)).toBe("1.00 CLTN");
  });
});

describe("formatTokenWithValueList", () => {
  const tokens: TokenWithValue[] = [
    {
      isLPToken: false,
      amount: big(1000000) as U<Token<Big>>,
      denom: "denom1",
      symbol: "CLTN1",
      precision: 6,
      price: undefined,
      value: undefined,
      logo: undefined,
    },
    {
      isLPToken: false,
      amount: big(2000000) as U<Token<Big>>,
      denom: "denom2",
      symbol: "CLTN2",
      precision: 6,
      price: undefined,
      value: undefined,
      logo: undefined,
    },
    {
      isLPToken: false,
      amount: big(3000000) as U<Token<Big>>,
      denom: "denom3",
      symbol: "CLTN3",
      precision: 6,
      price: undefined,
      value: undefined,
      logo: undefined,
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
