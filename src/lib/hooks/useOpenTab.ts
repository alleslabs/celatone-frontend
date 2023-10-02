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
  const balancesApiRoute = useBaseApiRoute("balances");

  return useCallback(
    (walletAddr: string) => {
      openNewTab(`${balancesApiRoute}/${walletAddr}`);
    },
    [balancesApiRoute]
  );
};

export const useOpenTab = () => {
  const { currentChainId } = useCelatoneApp();

  return useCallback(
    ({
      pathname,
      query,
    }: {
      pathname: string;
      query: Record<string, Option<string>>;
    }) => {
      const queryString = Object.entries(query).reduce(
        (acc, [key, value], idx) =>
          acc.concat(
            `${key}=${value}${idx !== Object.keys(query).length - 1 ? "&" : ""}`
          ),
        ""
      );
      openNewTab(`/${currentChainId}${pathname}?${queryString}`);
    },
    [currentChainId]
  );
};
