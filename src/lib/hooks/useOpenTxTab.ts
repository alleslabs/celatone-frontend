import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import { CELATONE_API_ENDPOINT, getChainApiPath } from "env";
import { useChainId } from "lib/app-provider";
import { getNetworkByChainName } from "lib/data";
import type { Option } from "lib/types";

export const openNewTab = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

export const useOpenTxTab = (type: "lcd" | "tx-page") => {
  const { currentChainName } = useWallet();
  const chainId = useChainId();
  const baseUrl =
    type === "lcd"
      ? `${CELATONE_API_ENDPOINT}/txs/${getChainApiPath(
          currentChainName
        )}/${chainId}`
      : `/${getNetworkByChainName(currentChainName)}/txs`;

  return useCallback(
    (txHash: Option<string>) => {
      openNewTab(`${baseUrl}/${txHash}`);
    },
    [baseUrl]
  );
};
