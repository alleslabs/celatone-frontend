import { useCallback } from "react";

import { useBaseApiRoute, useChainId } from "lib/app-provider";
import type { Option } from "lib/types";

export const openNewTab = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

export const useOpenTxTab = (type: "lcd" | "tx-page") => {
  const chainId = useChainId();
  const txsApiRoute = useBaseApiRoute("txs");
  const baseUrl = type === "lcd" ? txsApiRoute : `/${chainId}/tx`;

  return useCallback(
    (txHash: Option<string>) => {
      openNewTab(`${baseUrl}/${txHash}`);
    },
    [baseUrl]
  );
};
