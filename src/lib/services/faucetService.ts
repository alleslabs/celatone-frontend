import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useFaucetConfig } from "lib/app-provider";
import { big } from "lib/types";
import type { Token, U } from "lib/types";
import { deexponentify, getTokenLabel } from "lib/utils";

import { useAssetInfos } from "./assetService";
import type { FaucetResponse } from "./faucet";
import { queryFaucetInfo } from "./faucet";

interface FaucetInfo extends FaucetResponse {
  formattedAmount: string;
  formattedDenom: string;
}

export const useFaucetInfo = (): UseQueryResult<FaucetInfo> => {
  const faucet = useFaucetConfig({ shouldRedirect: false });
  const { data: assetInfos } = useAssetInfos({ withPrices: false });
  const queryFn = async (): Promise<FaucetInfo> => {
    const faucetInfo = await queryFaucetInfo(faucet.enabled ? faucet.url : "");
    const assetInfo = assetInfos?.[faucetInfo.Denom];
    const [formattedAmount, formattedDenom] = [
      deexponentify(
        big(faucetInfo.Amount).toFixed() as U<Token>,
        assetInfo?.precision
      ).toFixed(),
      getTokenLabel(faucetInfo.Denom, assetInfo?.symbol),
    ];
    return { ...faucetInfo, formattedAmount, formattedDenom };
  };

  return useQuery({
    queryKey: [CELATONE_QUERY_KEYS.FAUCET_INFO, faucet, assetInfos],
    queryFn,
    enabled: faucet.enabled,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
