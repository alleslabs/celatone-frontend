import { useCallback } from "react";

import { useBaseApiRoute } from "lib/app-provider";

import { openNewTab } from "./useOpenTxTab";

export const useOpenAssetTab = () => {
  const balancesApiRoute = useBaseApiRoute("balances");

  return useCallback(
    (walletAddr: string) => {
      openNewTab(`${balancesApiRoute}/${walletAddr}`);
    },
    [balancesApiRoute]
  );
};
