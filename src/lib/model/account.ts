import { useUserAssetInfos } from "lib/pages/account-details/data";
import { useAccountTableCounts } from "lib/services/accountService";
import type { HumanAddr, Option, Nullish } from "lib/types";

interface AccountDetailsTableCounts {
  tableCounts: {
    codesCount: Nullish<number>;
    contractsAdminCount: Nullish<number>;
    contractsCount: Nullish<number>;
    txsCount: Nullish<number>;
    proposalsCount: Nullish<number>;
    assetsCount: Option<number>;
  };
  isLoading: boolean;
  refetchCounts: () => void;
}

export const useAccountDetailsTableCounts = (
  walletAddress: HumanAddr
): AccountDetailsTableCounts => {
  const {
    data,
    refetch,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountTableCounts(walletAddress);
  const { totalData: assetsCount, isLoading: isLoadingAssetCount } =
    useUserAssetInfos(walletAddress);

  return {
    tableCounts: {
      codesCount: data?.code,
      contractsAdminCount: data?.contractByAdmin,
      contractsCount: data?.instantiated,
      txsCount: data?.tx,
      proposalsCount: data?.proposal,
      assetsCount,
    },
    isLoading: isLoadingAssetCount || isLoadingAccountTableCounts,
    refetchCounts: refetch,
  };
};
