import type { Coin } from "@cosmjs/stargate";

import { sortDenoms } from "./funds";

describe("sortDenoms", () => {
  const sortedCoins = [
    {
      denom: "#denom",
      amount: "10",
    },
    {
      denom: "1denom",
      amount: "10",
    },
    {
      denom: "Adenom",
      amount: "10",
    },
    {
      denom: "adenom",
      amount: "10",
    },
    {
      denom: "bdenom",
      amount: "10",
    },
  ] as Coin[];

  test("sort coins that are already in correct alphabetical order", () => {
    const coins = [
      {
        denom: "#denom",
        amount: "10",
      },
      {
        denom: "1denom",
        amount: "10",
      },
      {
        denom: "Adenom",
        amount: "10",
      },
      {
        denom: "adenom",
        amount: "10",
      },
      {
        denom: "bdenom",
        amount: "10",
      },
    ] as Coin[];
    expect(sortDenoms(coins)).toEqual(sortedCoins);
  });

  test("sort coins that are not in an alphabetical order", () => {
    const coins = [
      {
        denom: "Adenom",
        amount: "10",
      },
      {
        denom: "bdenom",
        amount: "10",
      },
      {
        denom: "#denom",
        amount: "10",
      },
      {
        denom: "adenom",
        amount: "10",
      },
      {
        denom: "1denom",
        amount: "10",
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
          denom: "adenom",
          amount: "10",
        },
      ])
    ).toEqual([
      {
        denom: "adenom",
        amount: "10",
      },
    ]);
  });
});
