import type { UseQueryResult } from "@tanstack/react-query";
import type { Token, U } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS } from "lib/app-provider";
import { big } from "lib/types";
import { deexponentify, getTokenLabel } from "lib/utils";

import type { FaucetResponse } from "./faucet";

import { useAssetInfos } from "./assetService";
import { queryFaucetInfo } from "./faucet";

interface FaucetInfo extends FaucetResponse {
  formattedAmount: string;
  formattedDenom: string;
}

export const useFaucetInfo = (): UseQueryResult<FaucetInfo> => {
  // NOTE: hacked to disable
  const faucet = { enabled: false, url: "" };

  // ------------------------------------------//

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
    enabled: faucet.enabled,
    queryFn,
    queryKey: [CELATONE_QUERY_KEYS.FAUCET_INFO, faucet, assetInfos],
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
