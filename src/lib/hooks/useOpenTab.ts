import type { Option } from "lib/types";

import {
  useBaseApiRoute,
  useCelatoneApp,
  useTierConfig,
} from "lib/app-provider";
import { openNewTab } from "lib/utils";
import { useCallback } from "react";

export const useOpenBlockTab = () => {
  const {
    chainConfig: { network_type, rest },
  } = useCelatoneApp();
  const blocksApiRoute = useBaseApiRoute("blocks");

  let baseUrl: string;
  if (network_type === "local") {
    baseUrl = `${rest}/cosmos/base/tendermint/v1beta1/blocks`;
  } else {
    baseUrl = blocksApiRoute;
  }
  return useCallback(
    (blockHeight: number) => {
      openNewTab(`${baseUrl}/${blockHeight}`);
    },
    [baseUrl]
  );
};

export const useOpenTxTab = (type: "rest" | "tx-page") => {
  const {
    chainConfig: { network_type, rest },
    currentChainId,
  } = useCelatoneApp();
  const txsApiRoute = useBaseApiRoute("txs");

  let baseUrl: string;
  if (type === "rest") {
    baseUrl =
      network_type === "local" ? `${rest}/cosmos/tx/v1beta1/txs` : txsApiRoute;
  } else baseUrl = `/${currentChainId}/txs`;

  return useCallback(
    (txHash: Option<string>) => {
      if (!txHash) return;
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
          : `${restEndpoint}/cosmos/bank/v1beta1/balances/${walletAddr}?pagination.limit=100`
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
