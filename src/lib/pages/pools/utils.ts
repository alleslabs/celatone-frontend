import { UNDEFINED_ICON_LIST } from "lib/data";

export const getUndefinedTokenIcon = (denom: string) => {
  const index = denom.split("").reduce((v, c) => v + c.charCodeAt(0), 0);
  return UNDEFINED_ICON_LIST[index % UNDEFINED_ICON_LIST.length];
};
