import type { Coin } from "@cosmjs/stargate";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import type Big from "big.js";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import { big } from "lib/types";
import type { BechAddr, Option, TokenWithValue, USD } from "lib/types";
import {
  coinToTokenWithValue,
  compareTokenWithValues,
  filterSupportedTokens,
  totalValueTokenWithValue,
} from "lib/utils";

import { useAssetInfos } from "./assetService";
import { getBalances } from "./balance";
import { useMovePoolInfos } from "./move";

interface BalanceInfos {
  supportedAssets: TokenWithValue[];
  totalSupportedAssetsValue: Option<USD<Big>>;
  unsupportedAssets: TokenWithValue[];
  isLoading: boolean;
  totalData: Option<number>;
  error: Error;
}

export const useBalances = (address: BechAddr): UseQueryResult<Coin[]> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.BALANCES, endpoint, address],
    async () => getBalances(endpoint, address),
    { enabled: !!address, retry: 1, refetchOnWindowFocus: false }
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
