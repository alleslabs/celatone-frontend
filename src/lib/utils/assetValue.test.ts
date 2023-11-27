import big from "big.js";
import type Big from "big.js";

import type { Token, TokenWithValue, U, USD } from "lib/types";

import { addTokenWithValue } from "./assetValue";

describe("addTokenWithValue", () => {
  const tokenWithValue1: TokenWithValue = {
    isLPToken: false,
    denom: "uadenom",
    amount: big(100) as U<Token<Big>>,
    symbol: "",
    logo: "",
    precision: 6,
    price: big(35) as USD<Big>,
    value: big(3500) as USD<Big>,
  };

  const tokenWithValue2: TokenWithValue = {
    isLPToken: false,
    denom: "uadenom",
    amount: big(100) as U<Token<Big>>,
    symbol: "",
    logo: "",
    precision: 6,
    price: big(35) as USD<Big>,
    value: big(3500) as USD<Big>,
  };

  const tokenWithValue3: TokenWithValue = {
    isLPToken: false,
    denom: "ubdenom",
    amount: big(100) as U<Token<Big>>,
    symbol: "",
    logo: "",
    precision: 6,
    price: big(2) as USD<Big>,
    value: big(400) as USD<Big>,
  };

  test("no old total value", () => {
    expect(addTokenWithValue(undefined, tokenWithValue1)).toEqual(
      tokenWithValue1
    );
  });

  test("old value + new value", () => {
    const expectResult: TokenWithValue = {
      isLPToken: false,
      denom: "uadenom",
      amount: big(200) as U<Token<Big>>,
      symbol: "",
      precision: 6,
      logo: "",
      price: big(35) as USD<Big>,
      value: big(7000) as USD<Big>,
    };
    expect(addTokenWithValue(tokenWithValue1, tokenWithValue2)).toEqual(
      expectResult
    );
    expect(addTokenWithValue(tokenWithValue2, tokenWithValue1)).toEqual(
      expectResult
    );
  });

  test("invalid, when denoms are not the same", () => {
    expect(addTokenWithValue(tokenWithValue1, tokenWithValue3)).toEqual({
      isLPToken: false,
      denom: "",
      amount: big(0) as U<Token<Big>>,
      symbol: undefined,
      precision: undefined,
      logo: undefined,
      price: big(0) as USD<Big>,
      value: big(0) as USD<Big>,
    });
    expect(addTokenWithValue(tokenWithValue1, tokenWithValue3)).toEqual({
      isLPToken: false,
      denom: "",
      amount: big(0) as U<Token<Big>>,
      symbol: undefined,
      precision: undefined,
      logo: undefined,
      price: big(0) as USD<Big>,
      value: big(0) as USD<Big>,
    });
  });
});
