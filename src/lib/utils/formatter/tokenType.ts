import { truncate } from "../truncate";

import { capitalize } from "./text";

export const getTokenType = (type: string) => {
  switch (type.toLowerCase()) {
    case "ibc":
    case "cw20":
      return type.toUpperCase();
    default:
      return capitalize(type);
  }
};

export const getTokenLabel = (denom: string, symbol?: string) => {
  if (symbol) return symbol;

  const splitId = denom.split("/");
  if (splitId.length === 1) return denom;

  splitId[1] = truncate(splitId[1]);
  return splitId.join("/");
};
