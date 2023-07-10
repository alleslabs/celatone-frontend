import { UNDEFINED_TOKEN_LIST } from "./constant";

export const getUndefinedTokenIcon = (denom: string) => {
  const index = denom.split("").reduce((v, c) => v + c.charCodeAt(0), 0);
  return UNDEFINED_TOKEN_LIST[index % UNDEFINED_TOKEN_LIST.length];
};
