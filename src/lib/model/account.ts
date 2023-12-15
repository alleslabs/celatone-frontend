import { useAccountTableCounts } from "lib/services/accountService";
import { useBalanceInfos } from "lib/services/balanceService";
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
    useBalanceInfos(walletAddress);

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
