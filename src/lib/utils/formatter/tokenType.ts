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

export const getTokenLabel = (denom: string) => {
  if (denom[0] === "u") {
    return denom.replace("u", "").toUpperCase();
  }
  const splitId = denom.split("/");
  if (splitId[1]) {
    splitId[1] = truncate(splitId[1]);
  }
  return splitId.length === 1 ? denom : splitId.join("/");
};
