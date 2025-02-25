import { capitalize } from "lodash";

import type { Option } from "lib/types";
import { truncate } from "../truncate";

export const getTokenType = (type: string) => {
  switch (type.toLowerCase()) {
    case "ibc":
    case "cw20":
    case "evm":
      return type.toUpperCase();
    default:
      return capitalize(type);
  }
};

export const getTokenLabel = (
  denom: string,
  symbol: Option<string>,
  isTruncate = true
) => {
  if (symbol) return symbol;

  const splitId = denom.split("/");
  if (splitId.length === 1) return denom;

  splitId[1] = isTruncate ? truncate(splitId[1]) : splitId[1];
  return splitId.join("/");
};
