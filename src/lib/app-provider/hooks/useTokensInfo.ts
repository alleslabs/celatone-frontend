import { useMemo } from "react";

import { useCurrentChain } from "./useCurrentChain";

export const useNativeTokensInfo = () => {
  const { assets } = useCurrentChain();
  return useMemo(
    () => assets?.assets.filter((asset) => !asset.base.includes("cw20")) ?? [],
    [assets]
  );
};
