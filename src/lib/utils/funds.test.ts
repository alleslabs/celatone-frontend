import type { Coin } from "@cosmjs/stargate";

import { coinsFromStr, coinsToStr, sortDenoms } from "./funds";

describe("sortDenoms", () => {
  const sortedCoins = [
    {
      amount: "10",
      denom: "#denom",
    },
    {
      amount: "10",
      denom: "1denom",
    },
    {
      amount: "10",
      denom: "Adenom",
    },
    {
      amount: "10",
      denom: "adenom",
    },
    {
      amount: "10",
      denom: "bdenom",
    },
  ] as Coin[];

  test("sort coins that are already in correct alphabetical order", () => {
    const coins = [
      {
        amount: "10",
        denom: "#denom",
      },
      {
        amount: "10",
        denom: "1denom",
      },
      {
        amount: "10",
        denom: "Adenom",
      },
      {
        amount: "10",
        denom: "adenom",
      },
      {
        amount: "10",
        denom: "bdenom",
      },
    ] as Coin[];
    expect(sortDenoms(coins)).toEqual(sortedCoins);
  });

  test("sort coins that are not in an alphabetical order", () => {
    const coins = [
      {
        amount: "10",
        denom: "Adenom",
      },
      {
        amount: "10",
        denom: "bdenom",
      },
      {
        amount: "10",
        denom: "#denom",
      },
      {
        amount: "10",
        denom: "adenom",
      },
      {
        amount: "10",
        denom: "1denom",
      },
    ] as Coin[];
    expect(sortDenoms(coins)).toEqual(sortedCoins);
  });

  test("sort empty coins", () => {
    expect(sortDenoms([])).toEqual([]);
  });

  test("sort 1 coin", () => {
    expect(
      sortDenoms([
        {
          amount: "10",
          denom: "adenom",
        },
      ])
    ).toEqual([
      {
        amount: "10",
        denom: "adenom",
      },
    ]);
  });

  test("parse Coins from empty string", () => {
    expect(coinsFromStr("")).toEqual([]);
  });

  test("parse Coins from string", () => {
    expect(coinsFromStr("1000adenom, 1ibc/bdenom")).toEqual([
      { amount: "1000", denom: "adenom" },
      {
        amount: "1",
        denom: "ibc/bdenom",
      },
    ]);
  });

  test("parse empty Coins to string", () => {
    expect(coinsToStr([])).toEqual("");
  });

  test("parse Coins to string", () => {
    expect(
      coinsToStr([
        {
          amount: "1",
          denom: "ibc/bdenom",
        },
        { amount: "1000", denom: "adenom" },
      ])
    ).toEqual("1ibc/bdenom,1000adenom");
  });
});
