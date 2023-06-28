import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import big from "big.js";

import { useChainRecordAsset, useFaucetConfig } from "lib/app-provider";
import type { Token, U } from "lib/types";
import { deexponentify, getTokenLabel } from "lib/utils";

import type { FaucetResponse } from "./faucet";
import { queryFaucetInfo } from "./faucet";

interface FaucetInfo extends FaucetResponse {
  formattedAmount: string;
  formattedDenom: string;
}

export const useFaucetInfo = (): UseQueryResult<FaucetInfo> => {
  const faucet = useFaucetConfig({ shouldRedirect: false });
  const getAssetInfo = useChainRecordAsset();
  const queryFn = async (): Promise<FaucetInfo> => {
    const faucetInfo = await queryFaucetInfo(faucet.enabled ? faucet.url : "");
    const assetInfo = getAssetInfo(faucetInfo.Denom);
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
    queryKey: ["query", "faucet_info", faucet],
    queryFn,
    enabled: faucet.enabled,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
