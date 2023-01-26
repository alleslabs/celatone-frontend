import { truncate } from "../truncate";

export const getTokenType = (type: string) => {
  switch (type.toLowerCase()) {
    case "ibc":
    case "cw20":
      return type.toUpperCase();
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
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
