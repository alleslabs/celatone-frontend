import type { Coin } from "@cosmjs/stargate";

import type { Token } from "lib/types";

import { exponentify } from "./formatter";

export const sortDenoms = (assets: Coin[]): Coin[] =>
  assets.sort(({ denom: aDenom }, { denom: bDenom }) =>
    aDenom.localeCompare(bDenom)
  );

interface CoinWithPrecision {
  denom: string;
  amount: string;
  precision: number;
}

export const fabricateFunds = (assets: CoinWithPrecision[]): Coin[] =>
  sortDenoms(
    assets
      .filter((asset) => Number(asset.amount) && asset.denom)
      .map((asset) => ({
        ...asset,
        amount: exponentify(
          (asset.amount || 0) as Token,
          asset.precision
        ).toFixed(0),
      }))
  );
