import type { Coin } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Big } from "big.js";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import { big } from "lib/types";
import type { BechAddr, Option, TokenWithValue, USD } from "lib/types";
import {
  coinToTokenWithValue,
  compareTokenWithValues,
  filterSupportedTokens,
  totalValueTokenWithValue,
} from "lib/utils";

import { getBalances } from "./api";
import { getBalancesRest } from "./rest";
import { useAssetInfos } from "../assetService";
import { useMovePoolInfos } from "../move/poolService";
import type { BalanceInfos } from "../types";

export const useBalances = (
  address: Option<BechAddr>,
  enabled = true
): UseQueryResult<Coin[]> => {
  const {
    chainConfig: { chain, rest: restEndpoint },
  } = useCelatoneApp();
  const isSei = chain === "sei";
  const apiEndpoint = useBaseApiRoute("accounts");
  const endpoint = isSei ? apiEndpoint : restEndpoint;

  return useQuery(
    [CELATONE_QUERY_KEYS.BALANCES, endpoint, address, isSei],
    async () => {
      if (!address) throw new Error("address is undefined (useBalances)");
      return isSei
        ? getBalances(endpoint, address)
        : getBalancesRest(endpoint, address);
    },
    { retry: 1, refetchOnWindowFocus: false, enabled }
  );
};

export const useBalanceInfos = (address: BechAddr): BalanceInfos => {
  const { data: assetInfos, isLoading: isAssetInfosLoading } = useAssetInfos({
    withPrices: true,
  });
  const { data: movePoolInfos } = useMovePoolInfos({
    withPrices: true,
  });
  const { data: accountBalances, isLoading, error } = useBalances(address);

  const balances = accountBalances
    ?.map<TokenWithValue>((balance) =>
      coinToTokenWithValue(
        balance.denom,
        balance.amount,
        assetInfos,
        movePoolInfos
      )
    )
    .sort(compareTokenWithValues);

  // Supported assets should order by descending value
  const {
    supportedTokens: supportedAssets,
    unsupportedTokens: unsupportedAssets,
  } = filterSupportedTokens(balances);
  const totalSupportedAssetsValue = balances
    ? totalValueTokenWithValue(supportedAssets, big(0) as USD<Big>)
    : undefined;

  return {
    supportedAssets,
    totalSupportedAssetsValue,
    unsupportedAssets,
    isLoading: isLoading || isAssetInfosLoading,
    totalData: balances?.length,
    error: error as Error,
  };
};
