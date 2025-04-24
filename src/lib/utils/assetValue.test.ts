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
        amount: big(100) as U<Token<Big>>,
        denom: "denom",
        isLPToken: false,
        logo: "",
        precision: 6,
        price: big(0) as USD<Big>,
        symbol: "",
        value: big(0) as USD<Big>,
      })
    ).toEqual(true);
  });

  test("unsupported token", () => {
    expect(
      isSupportedToken({
        amount: big(100) as U<Token<Big>>,
        denom: "denom",
        isLPToken: false,
        logo: "",
        precision: 6,
        price: undefined,
        symbol: "",
        value: undefined,
      })
    ).toEqual(false);
  });
});

describe("filterSupportedTokens", () => {
  const token1: TokenWithValue = {
    amount: big(100) as U<Token<Big>>,
    denom: "denom1",
    isLPToken: false,
    logo: "",
    precision: 6,
    price: undefined,
    symbol: "",
    value: big(0) as USD<Big>,
  };

  const token2: TokenWithValue = {
    amount: big(0) as U<Token<Big>>,
    denom: "denom2",
    isLPToken: false,
    logo: undefined,
    precision: undefined,
    price: big(2) as USD<Big>,
    symbol: undefined,
    value: undefined,
  };

  const token3: TokenWithValue = {
    amount: big(100) as U<Token<Big>>,
    denom: "denom3",
    isLPToken: true,
    logo: ["", ""],
    poolInfo: {
      coinA: {
        amount: big(0) as U<Token<Big>>,
        denom: "",
        precision: undefined,
        symbol: undefined,
      },
      coinB: {
        amount: big(0) as U<Token<Big>>,
        denom: "",
        precision: undefined,
        symbol: undefined,
      },
    },
    precision: 6,
    price: big(0) as USD<Big>,
    symbol: "",
    value: big(3500) as USD<Big>,
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
    amount: "100",
    denom: "uadenom",
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
        amountAPerShare: big(1) as U<Token<Big>>,
        denom: "denom1",
        metadata: zHexAddr.parse("0x1"),
        precision: 6,
        symbol: undefined,
      },
      coinB: {
        amountBPerShare: big(1) as U<Token<Big>>,
        denom: "denom2",
        metadata: zHexAddr.parse("0x2"),
        precision: 6,
        symbol: "DENOM_2",
      },
      logo: ["denom1_logo", "denom2_logo"],
      lpPricePerPShare: big(0.000001) as USD<Big>,
      precision: 6,
    },
  };

  const assetInfo = assetInfos.uadenom;
  const tokenAssetInfo: TokenWithValue = {
    amount: big(coin.amount) as U<Token<Big>>,
    denom: coin.denom,
    isLPToken: false,
    logo: assetInfo.logo,
    precision: assetInfo.precision,
    price: big(assetInfo.price) as USD<Big>,
    symbol: assetInfo.symbol,
    value: big(coin.amount)
      .mul(big(assetInfo.price))
      .div(10 ** assetInfo.precision) as USD<Big>,
  };

  const movePoolInfo = movePoolInfos.uadenom;
  const tokenMovePoolInfo: TokenWithValue = {
    amount: big(coin.amount) as U<Token<Big>>,
    denom: coin.denom,
    isLPToken: true,
    logo: movePoolInfo.logo,
    poolInfo: {
      coinA: {
        amount: movePoolInfo.coinA.amountAPerShare.times(coin.amount) as U<
          Token<Big>
        >,
        denom: movePoolInfo.coinA.denom,
        precision: 6,
        symbol: movePoolInfo.coinA.symbol,
      },
      coinB: {
        amount: movePoolInfo.coinB.amountBPerShare.times(coin.amount) as U<
          Token<Big>
        >,
        denom: movePoolInfo.coinB.denom,
        precision: 6,
        symbol: movePoolInfo.coinB.symbol,
      },
    },
    precision: movePoolInfo.precision,
    price: movePoolInfo.lpPricePerPShare,
    symbol: `${movePoolInfo.coinA.denom}-${movePoolInfo.coinB.symbol}`,
    value: big(coin.amount)
      .mul(movePoolInfo.lpPricePerPShare ?? big(0))
      .div(10 ** movePoolInfo.precision) as USD<Big>,
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
    amount: big(100) as U<Token<Big>>,
    denom: "uadenom",
    isLPToken: false,
    logo: "",
    precision: 6,
    price: big(35) as USD<Big>,
    symbol: "",
    value: big(3500) as USD<Big>,
  };

  const tokenWithValue2: TokenWithValue = {
    amount: big(100) as U<Token<Big>>,
    denom: "uadenom",
    isLPToken: false,
    logo: "",
    precision: 6,
    price: big(35) as USD<Big>,
    symbol: "",
    value: big(3500) as USD<Big>,
  };

  const tokenWithValue3: TokenWithValue = {
    amount: big(100) as U<Token<Big>>,
    denom: "ubdenom",
    isLPToken: false,
    logo: "",
    precision: 6,
    price: big(2) as USD<Big>,
    symbol: "",
    value: big(400) as USD<Big>,
  };

  test("no old total value", () => {
    expect(addTokenWithValue(undefined, tokenWithValue1)).toEqual(
      tokenWithValue1
    );
  });

  test("old value + new value", () => {
    const expectResult: TokenWithValue = {
      amount: big(200) as U<Token<Big>>,
      denom: "uadenom",
      isLPToken: false,
      logo: "",
      precision: 6,
      price: big(35) as USD<Big>,
      symbol: "",
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
      amount: big(0) as U<Token<Big>>,
      denom: "",
      isLPToken: false,
      logo: undefined,
      precision: undefined,
      price: big(0) as USD<Big>,
      symbol: undefined,
      value: big(0) as USD<Big>,
    });
    expect(addTokenWithValue(tokenWithValue1, tokenWithValue3)).toEqual({
      amount: big(0) as U<Token<Big>>,
      denom: "",
      isLPToken: false,
      logo: undefined,
      precision: undefined,
      price: big(0) as USD<Big>,
      symbol: undefined,
      value: big(0) as USD<Big>,
    });
  });
});
