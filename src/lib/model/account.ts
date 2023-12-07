import { useUserAssetInfos } from "lib/pages/account-details/data";
import { useAccountTableCount } from "lib/services/accountService";
import type { HumanAddr, Option } from "lib/types";

interface AccountDetailsTableCounts {
  tableCounts: {
    codesCount: Option<number>;
    contractsAdminCount: Option<number>;
    contractsCount: Option<number>;
    txsCount: Option<number>;
    proposalsCount: Option<number>;
    assetsCount: Option<number>;
  };
  refetchCounts: () => void;
}

/**
 * @remark
 * Counts for stored codes, contract admin, contract instances, transactions, and opened proposals tables
 */
export const useAccountDetailsTableCounts = (
  walletAddress: HumanAddr
): AccountDetailsTableCounts => {
  const { data, refetch } = useAccountTableCount(walletAddress);

  const { totalData: assetsCount } = useUserAssetInfos(walletAddress);

  return {
    tableCounts: {
      codesCount: data?.code,
      contractsAdminCount: data?.contract_by_admin,
      contractsCount: data?.instantiated,
      txsCount: data?.tx,
      proposalsCount: data?.proposal,
      assetsCount,
    },
    refetchCounts: refetch,
  };
};
