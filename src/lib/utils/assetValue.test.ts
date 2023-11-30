import big from "big.js";
import type Big from "big.js";

import type {
  AssetInfo,
  Balance,
  BalanceWithAssetInfo,
  HexAddr,
  MovePoolInfos,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import {
  addTokenWithValue,
  calAssetValueWithPrecision,
  calTotalValue,
  coinToTokenWithValue,
} from "./assetValue";
import { formatUTokenWithPrecision } from "./formatter";

describe("calAssetValueWithPrecision", () => {
  describe("invalid with error", () => {
    test("text string as an amount", () => {
      const balance = {
        amount: "invalid",
        id: "udenom",
        precision: 1,
      } as Balance;
      expect(() => calAssetValueWithPrecision(balance)).toThrow();
    });

    test("empty string as an amount", () => {
      const balance = {
        amount: "",
        id: "udenom",
        precision: 1,
      } as Balance;
      expect(() => calAssetValueWithPrecision(balance)).toThrow();
    });

    test("space string as an amount", () => {
      const balance = {
        amount: " ",
        id: "udenom",
        precision: 1,
      } as Balance;
      expect(() => calAssetValueWithPrecision(balance)).toThrow();
    });
  });

  describe("undefined balance price", () => {
    test("undefined price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0"));
    });
  });

  describe("with valid balance price", () => {
    test("zero price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        precision: 1,
        price: 0,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0"));
    });

    test("decimal price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        price: 20.2,
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("202"));
    });

    test("integer price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        price: 20,
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("200"));
    });

    test("negative price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        price: -20,
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("-200"));
    });

    test("hex price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        price: 0x14,
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("200"));
    });

    test("binary price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        price: 0b10100,
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("200"));
    });

    test("exponential price", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        price: 1e2,
        precision: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("1000"));
    });
  });

  describe("with valid balance amount value", () => {
    test("zero amount", () => {
      const balance = {
        amount: "0",
        id: "udenom",
        precision: 6,
        price: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0"));
    });

    test("integer amount", () => {
      const balance = {
        amount: "100",
        id: "udenom",
        precision: 6,
        price: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0.0001"));
    });

    test("decimal amount", () => {
      const balance = {
        amount: "100.2",
        id: "udenom",
        precision: 6,
        price: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0.0001002"));
    });

    test("negative amount should return 0", () => {
      const balance = {
        amount: "-100",
        id: "udenom",
        precision: 6,
        price: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0"));
    });

    test("amount with space should trim", () => {
      const balance = {
        amount: " 100 ",
        id: "udenom",
        precision: 6,
        price: 1,
      } as Balance;
      expect(calAssetValueWithPrecision(balance)).toEqual(big("0.0001"));
    });
  });
});

describe("calTotalValue", () => {
  test("two assets with same precision", () => {
    const balanceWithAssetInfo = [
      {
        balance: {
          amount: "1000",
          id: "uadenom",
          name: "BDenom",
          precision: 6,
          price: 1,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          description: "",
          id: "uadenom",
          logo: "",
          name: "",
          precision: 6,
          price: 1,
          slugs: ["adenom"],
          symbol: "ADenom",
          type: "native",
        },
      },
      {
        balance: {
          amount: "2715262",
          id: "ubdenom",
          name: "BDeom",
          precision: 6,
          price: 0.489394,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          coinmarketcap: "",
          description: "",
          id: "ubdenom",
          logo: "",
          name: "",
          precision: 6,
          price: 0.489394,
          slugs: ["bdenom"],
          symbol: "BDENOM",
          type: "native",
        },
      },
    ] as BalanceWithAssetInfo[];
    expect(calTotalValue(balanceWithAssetInfo)).toEqual(big(1.329832931228));
  });

  test("two assets with different precision", () => {
    const balanceWithAssetInfo = [
      {
        balance: {
          amount: "1000",
          id: "uadenom",
          name: "BDenom",
          precision: 8,
          price: 1,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          description: "",
          id: "uadenom",
          logo: "",
          name: "",
          precision: 8,
          price: 1,
          slugs: ["adenom"],
          symbol: "ADenom",
          type: "native",
        },
      },
      {
        balance: {
          amount: "2715262",
          id: "ubdenom",
          name: "BDeom",
          precision: 6,
          price: 0.489394,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          coinmarketcap: "",
          description: "",
          id: "ubdenom",
          logo: "",
          name: "",
          precision: 6,
          price: 0.489394,
          slugs: ["bdenom"],
          symbol: "BDENOM",
          type: "native",
        },
      },
    ] as BalanceWithAssetInfo[];
    expect(calTotalValue(balanceWithAssetInfo)).toEqual(big(1.328842931228));
  });

  test("two assets where one asset doesn't have price", () => {
    const balanceWithAssetInfo = [
      {
        balance: {
          amount: "1000",
          id: "uadenom",
          name: "BDenom",
          precision: 6,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          coinmarketcap: "",
          description: "",
          id: "uadenom",
          logo: "",
          name: "ADenom Token",
          precision: 6,
          slugs: ["adenom"],
          symbol: "ADenom",
          type: "native",
        },
      },
      {
        balance: {
          amount: "2715262",
          id: "ubdenom",
          name: "BDeom",
          precision: 6,
          price: 0.489394,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          description: "",
          id: "ubdenom",
          logo: "",
          name: "BDenom Token",
          precision: 6,
          price: 0.489394,
          slugs: ["bdenom"],
          symbol: "BDENOM",
          type: "native",
        },
      },
    ] as BalanceWithAssetInfo[];
    expect(calTotalValue(balanceWithAssetInfo)).toEqual(big(1.328832931228));
  });

  test("two assets where both don't have price", () => {
    const balanceWithAssetInfo = [
      {
        balance: {
          amount: "1000",
          id: "uadenom",
          name: "BDenom",
          precision: 6,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          description: "",
          id: "uadenom",
          logo: "",
          name: "ADenom Token",
          precision: 6,
          slugs: ["adenom"],
          symbol: "ADenom",
          type: "native",
        },
      },
      {
        balance: {
          amount: "2715262",
          id: "ubdenom",
          name: "BDeom",
          precision: 6,
          symbol: "BDENOM",
          type: "native",
        },
        assetInfo: {
          coingecko: "",
          coinmarketcap: "",
          description: "",
          id: "ubdenom",
          logo: "",
          name: "BDenom Token",
          precision: 6,
          slugs: ["bdenom"],
          symbol: "BDENOM",
          type: "native",
        },
      },
    ] as BalanceWithAssetInfo[];
    expect(calTotalValue(balanceWithAssetInfo)).toEqual(big(0));
  });

  test("empty balance with asset", () => {
    expect(calTotalValue([])).toEqual(big(0));
  });
});

describe("coinToTokenWithValue", () => {
  const coin = {
    denom: "uadenom",
    amount: "100",
  };

  const assetInfos: Record<string, AssetInfo> = {
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
        metadata: "0x1" as HexAddr,
        denom: "denom1",
        precision: 6,
        amountAPerShare: big(1),
        symbol: undefined,
      },
      coinB: {
        metadata: "0x2" as HexAddr,
        denom: "denom2",
        precision: 6,
        amountBPerShare: big(1),
        symbol: "DENOM_2",
      },
      lpPricePerShare: big(1) as USD<Big>,
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
    price: movePoolInfo.lpPricePerShare,
    value: big(coin.amount)
      .mul(movePoolInfo.lpPricePerShare ?? big(0))
      .div(10 ** movePoolInfo.precision) as USD<Big>,
    poolInfo: {
      coinA: {
        amount: formatUTokenWithPrecision(
          big(coin.amount).times(movePoolInfo.coinA.amountAPerShare) as U<
            Token<Big>
          >,
          movePoolInfo.precision
        ),
        denom: movePoolInfo.coinA.denom,
        symbol: movePoolInfo.coinA.symbol,
      },
      coinB: {
        amount: formatUTokenWithPrecision(
          big(coin.amount).times(movePoolInfo.coinB.amountBPerShare) as U<
            Token<Big>
          >,
          movePoolInfo.precision
        ),
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
