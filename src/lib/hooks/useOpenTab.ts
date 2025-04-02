import { useCallback } from "react";

import {
  useBaseApiRoute,
  useCelatoneApp,
  useTierConfig,
} from "lib/app-provider";
import type { Option } from "lib/types";
import { openNewTab } from "lib/utils";

export const useOpenBlockTab = () => {
  const blocksApiRoute = useBaseApiRoute("blocks");

  return useCallback(
    (blockHeight: number) => {
      openNewTab(`${blocksApiRoute}/${blockHeight}`);
    },
    [blocksApiRoute]
  );
};

export const useOpenTxTab = (type: "rest" | "tx-page") => {
  const {
    currentChainId,
    chainConfig: { network_type, rest },
  } = useCelatoneApp();
  const txsApiRoute = useBaseApiRoute("txs");

  let baseUrl: string;
  if (type === "rest") {
    baseUrl =
      network_type === "local" ? `${rest}/cosmos/tx/v1beta1/txs` : txsApiRoute;
  } else baseUrl = `/${currentChainId}/txs`;

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
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useCallback(
    (walletAddr: string) => {
      openNewTab(
        isFullTier
          ? `${apiEndpoint}/${walletAddr}/balances`
          : `${restEndpoint}/cosmos/bank/v1beta1/balances/${walletAddr}?pagination.limit=1000`
      );
    },
    [apiEndpoint, isFullTier, restEndpoint]
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
