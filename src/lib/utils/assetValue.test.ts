import type Big from "big.js";
import type {
  AssetInfos,
  MovePoolInfos,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import { big, zHexAddr } from "lib/types";

import {
  addTokenWithValue,
  coinToTokenWithValue,
  filterSupportedTokens,
  isSupportedToken,
} from "./assetValue";

describe("isSupportedToken", () => {
  test("supported token", () => {
    expect(
      isSupportedToken({
        isLPToken: false,
        denom: "denom",
        amount: big(100) as U<Token<Big>>,
        symbol: "",
        logo: "",
        precision: 6,
        price: big(0) as USD<Big>,
        value: big(0) as USD<Big>,
      })
    ).toEqual(true);
  });

  test("unsupported token", () => {
    expect(
      isSupportedToken({
        isLPToken: false,
        denom: "denom",
        amount: big(100) as U<Token<Big>>,
        symbol: "",
        logo: "",
        precision: 6,
        price: undefined,
        value: undefined,
      })
    ).toEqual(false);
  });
});

describe("filterSupportedTokens", () => {
  const token1: TokenWithValue = {
    isLPToken: false,
    denom: "denom1",
    amount: big(100) as U<Token<Big>>,
    symbol: "",
    logo: "",
    precision: 6,
    price: undefined,
    value: big(0) as USD<Big>,
  };

  const token2: TokenWithValue = {
    isLPToken: false,
    logo: undefined,
    denom: "denom2",
    amount: big(0) as U<Token<Big>>,
    symbol: undefined,
    precision: undefined,
    price: big(2) as USD<Big>,
    value: undefined,
  };

  const token3: TokenWithValue = {
    isLPToken: true,
    denom: "denom3",
    amount: big(100) as U<Token<Big>>,
    symbol: "",
    logo: ["", ""],
    precision: 6,
    price: big(0) as USD<Big>,
    value: big(3500) as USD<Big>,
    poolInfo: {
      coinA: {
        denom: "",
        amount: big(0) as U<Token<Big>>,
        precision: undefined,
        symbol: undefined,
      },
      coinB: {
        denom: "",
        amount: big(0) as U<Token<Big>>,
        precision: undefined,
        symbol: undefined,
      },
    },
  };

  test("filter supported tokens undefined", () => {
    expect(filterSupportedTokens(undefined)).toEqual({
      supportedTokens: [],
      unsupportedTokens: [],
    });
  });

  test("filter supported tokens by price undefined", () => {
    expect(filterSupportedTokens([token1, token2, token3])).toEqual({
      supportedTokens: [token2, token3],
      unsupportedTokens: [token1],
    });
  });
});

describe("coinToTokenWithValue", () => {
  const coin = {
    denom: "uadenom",
    amount: "100",
  };

  const assetInfos: AssetInfos = {
    uadenom: {
      coingecko: "",
      description: "",
      id: "uadenom",
      logo: "adenom_logo",
      name: "A denom",
      precision: 6,
      price: 0.5,
      slugs: [],
      symbol: "ADENOM",
      type: "",
    },
  };

  const movePoolInfos: MovePoolInfos = {
    uadenom: {
      coinA: {
        metadata: zHexAddr.parse("0x1"),
        denom: "denom1",
        precision: 6,
        amountAPerShare: big(1) as U<Token<Big>>,
        symbol: undefined,
      },
      coinB: {
        metadata: zHexAddr.parse("0x2"),
        denom: "denom2",
        precision: 6,
        amountBPerShare: big(1) as U<Token<Big>>,
        symbol: "DENOM_2",
      },
      lpPricePerPShare: big(0.000001) as USD<Big>,
      precision: 6,
      logo: ["denom1_logo", "denom2_logo"],
    },
  };

  const assetInfo = assetInfos.uadenom;
  const tokenAssetInfo: TokenWithValue = {
    isLPToken: false,
    logo: assetInfo.logo,
    denom: coin.denom,
    amount: big(coin.amount) as U<Token<Big>>,
    symbol: assetInfo.symbol,
    precision: assetInfo.precision,
    price: big(assetInfo.price) as USD<Big>,
    value: big(coin.amount)
      .mul(big(assetInfo.price))
      .div(10 ** assetInfo.precision) as USD<Big>,
  };

  const movePoolInfo = movePoolInfos.uadenom;
  const tokenMovePoolInfo: TokenWithValue = {
    isLPToken: true,
    logo: movePoolInfo.logo,
    denom: coin.denom,
    amount: big(coin.amount) as U<Token<Big>>,
    symbol: `${movePoolInfo.coinA.denom}-${movePoolInfo.coinB.symbol}`,
    precision: movePoolInfo.precision,
    price: movePoolInfo.lpPricePerPShare,
    value: big(coin.amount)
      .mul(movePoolInfo.lpPricePerPShare ?? big(0))
      .div(10 ** movePoolInfo.precision) as USD<Big>,
    poolInfo: {
      coinA: {
        amount: movePoolInfo.coinA.amountAPerShare.times(coin.amount) as U<
          Token<Big>
        >,
        precision: 6,
        denom: movePoolInfo.coinA.denom,
        symbol: movePoolInfo.coinA.symbol,
      },
      coinB: {
        amount: movePoolInfo.coinB.amountBPerShare.times(coin.amount) as U<
          Token<Big>
        >,
        precision: 6,
        denom: movePoolInfo.coinB.denom,
        symbol: movePoolInfo.coinB.symbol,
      },
    },
  };

  test("coinToToken with only assetInfo", () => {
    expect(coinToTokenWithValue(coin.denom, coin.amount, assetInfos)).toEqual(
      tokenAssetInfo
    );
  });

  test("coinToToken with only movePoolInfo", () => {
    expect(
      coinToTokenWithValue(coin.denom, coin.amount, undefined, movePoolInfos)
    ).toEqual(tokenMovePoolInfo);
  });

  test("coinToToken with assetInfo and movePoolInfo", () => {
    expect(
      coinToTokenWithValue(coin.denom, coin.amount, assetInfos, movePoolInfos)
    ).toEqual(tokenMovePoolInfo);
  });
});

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
