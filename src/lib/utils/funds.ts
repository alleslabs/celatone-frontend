import type { Coin } from "@cosmjs/stargate";

import type { Token } from "lib/types";

import { microfy } from "./formatter/currency";

export const fabricateFunds = (assets: Coin[]): Coin[] =>
  assets
    .filter((asset) => Number(asset.amount) && asset.denom)
    .sort(({ denom: aDenom }, { denom: bDenom }) =>
      aDenom.localeCompare(bDenom)
    )
    .map((asset) => ({
      ...asset,
      amount: microfy(asset.amount as Token).toFixed(0),
    }));
