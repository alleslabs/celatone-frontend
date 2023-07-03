import type { Coin } from "@cosmjs/stargate";

import type { Token, Option } from "lib/types";

import { exponentify } from "./formatter";

export const sortDenoms = (assets: Coin[]): Coin[] =>
  assets.sort(({ denom: aDenom }, { denom: bDenom }) =>
    aDenom.localeCompare(bDenom)
  );

interface CoinWithPrecision extends Coin {
  precision: Option<number>;
}

export const fabricateFunds = (assets: CoinWithPrecision[]): Coin[] =>
  sortDenoms(
    assets
      .filter((asset) => Number(asset.amount) && asset.denom)
      .map((asset) => ({
        denom: asset.denom,
        amount: exponentify(asset.amount as Token, asset.precision).toFixed(0),
      }))
  );
