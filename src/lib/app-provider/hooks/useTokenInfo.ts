import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

export const useNativeTokensInfo = () => {
  const { currentChainRecord } = useWallet();

  return useMemo(
    () =>
      currentChainRecord?.assetList?.assets?.filter(
        (asset) => !asset.base.includes("cw20")
      ) ?? [],

    [currentChainRecord]
  );
};
