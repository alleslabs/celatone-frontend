import type { Coin } from "@cosmjs/stargate";

import type { Token } from "lib/types";

import { microfy } from "./formatter/currency";

export const sortDenoms = (assets: Coin[]): Coin[] =>
  assets.sort(({ denom: aDenom }, { denom: bDenom }) =>
    aDenom.localeCompare(bDenom)
  );

export const fabricateFunds = (assets: Coin[]): Coin[] =>
  sortDenoms(assets.filter((asset) => Number(asset.amount) && asset.denom)).map(
    (asset) => ({
      ...asset,
      amount: microfy(asset.amount as Token).toFixed(0),
    })
  );
