import { useCallback } from "react";

import { useBaseApiRoute, useCelatoneApp } from "lib/app-provider";
import type { Option } from "lib/types";
import { openNewTab } from "lib/utils";

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

export const useOpenAssetTab = () => {
  const balancesApiRoute = useBaseApiRoute("accounts");

  return useCallback(
    (walletAddr: string) => {
      openNewTab(`${balancesApiRoute}/${walletAddr}/balances`);
    },
    [balancesApiRoute]
  );
};

export const useOpenNewTab = () => {
  const { currentChainId } = useCelatoneApp();

  return useCallback(
    ({
      pathname,
      query,
    }: {
      pathname: string;
      query: Record<string, Option<string>>;
    }) => {
      const queryString = Object.entries(query)
        .reduce((acc, [key, value]) => {
          if (value) acc.append(key, value);
          return acc;
        }, new URLSearchParams())
        .toString();

      openNewTab(
        `/${currentChainId}${pathname}${queryString ? "?" : ""}${queryString}`
      );
    },
    [currentChainId]
  );
};
