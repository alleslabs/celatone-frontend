import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import { useChainId } from "lib/app-provider";

import { openNewTab } from "./useOpenTxTab";

export const useOpenAssetTab = () => {
  const { currentChainName } = useWallet();
  const chainId = useChainId();

  const baseUrl = `${CELATONE_API_ENDPOINT}/balances/${getChainApiPath(
    currentChainName
  )}/${chainId}`;

  return useCallback(
    (walletAddr: string) => {
      openNewTab(`${baseUrl}/${walletAddr}`);
    },
    [baseUrl]
  );
};
