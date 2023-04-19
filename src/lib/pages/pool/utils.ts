import { UndefinedTokenList } from "./components/constant";

export const getUndefinedTokenIcon = (denom: string) => {
  const index = denom.split("").reduce((v, c) => {
    return v + c.charCodeAt(0);
  }, 0);
  return UndefinedTokenList[index % UndefinedTokenList.length];
};
