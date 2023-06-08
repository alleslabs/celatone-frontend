import { useCallback } from "react";

import { useBaseApiRoute, useCelatoneApp } from "lib/app-provider";
import type { Option } from "lib/types";

export const openNewTab = (url: string) =>
  window.open(url, "_blank", "noopener,noreferrer");

export const useOpenTxTab = (type: "lcd" | "tx-page") => {
  const { currentChainId } = useCelatoneApp();
  const txsApiRoute = useBaseApiRoute("txs");
  const baseUrl = type === "lcd" ? txsApiRoute : `/${currentChainId}/txs`;

  return useCallback(
    (txHash: Option<string>) => {
      openNewTab(`${baseUrl}/${txHash}`);
    },
    [baseUrl]
  );
};
