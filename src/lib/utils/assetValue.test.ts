import big from "big.js";
import type Big from "big.js";

import type {
  Balance,
  BalanceWithAssetInfo,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import {
  addTokenWithValue,
  calAssetValueWithPrecision,
  calTotalValue,
} from "./assetValue";

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
          coinmarketcap: "",
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
          coinmarketcap: "",
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
          coinmarketcap: "",
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
