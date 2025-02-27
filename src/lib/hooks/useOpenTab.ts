import { useCallback } from "react";

import {
  useBaseApiRoute,
  useCelatoneApp,
  useTierConfig,
} from "lib/app-provider";
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
  const { isFullTier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("accounts");
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useCallback(
    (walletAddr: string) => {
      openNewTab(
        isFullTier
          ? `${apiEndpoint}/${walletAddr}/balances`
          : `${lcdEndpoint}/cosmos/bank/v1beta1/balances/${walletAddr}?pagination.limit=1000`
      );
    },
    [apiEndpoint, isFullTier, lcdEndpoint]
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
