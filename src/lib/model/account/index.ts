import type { Big } from "big.js";
import type { BechAddr, USD } from "lib/types";

import { useGovConfig, useInitia } from "lib/app-provider";
import { useBalanceInfos } from "lib/services/bank";
import { big } from "lib/types";
import { totalValueTokenWithValue } from "lib/utils";

import { useAccountDelegationInfosApi } from "./api";
import { useAccountDelegationInfosRest } from "./rest";

// ------------------------------------------//
// ----------------DELEGATIONS---------------//
// ------------------------------------------//

export const useAccountDelegationInfos = (address: BechAddr) => {
  const isInitia = useInitia();
  const resRest = useAccountDelegationInfosRest(address, !isInitia);
  const resApi = useAccountDelegationInfosApi(address, isInitia);

  return isInitia ? resApi : resRest;
};

export const useAccountTotalValue = (address: BechAddr) => {
  const defaultValue = big(0) as USD<Big>;

  const gov = useGovConfig({ shouldRedirect: false });
  const {
    isLoading: isLoadingTotalSupportedAssetsValue,
    totalSupportedAssetsValue = defaultValue,
  } = useBalanceInfos(address);
  const {
    isCommissionsLoading,
    isLoading,
    isRewardsLoading,
    isTotalBondedLoading,
    stakingParams,
    totalBonded,
    totalCommissions,
    totalRewards,
  } = useAccountDelegationInfos(address);

  if (!gov.enabled)
    return {
      isLoading: false,
      totalAccountValue: totalSupportedAssetsValue,
    };

  if (
    isLoading ||
    isTotalBondedLoading ||
    isRewardsLoading ||
    isCommissionsLoading ||
    isLoadingTotalSupportedAssetsValue
  )
    return { isLoading: true, totalAccountValue: undefined };

  if (!stakingParams || !totalBonded || !totalRewards || !totalCommissions)
    return { isLoading: false, totalAccountValue: undefined };

  return {
    isLoading: false,
    totalAccountValue: totalSupportedAssetsValue
      .add(totalValueTokenWithValue(totalBonded, defaultValue))
      .add(totalValueTokenWithValue(totalRewards, defaultValue))
      .add(
        totalValueTokenWithValue(totalCommissions, defaultValue)
      ) as USD<Big>,
  };
};
