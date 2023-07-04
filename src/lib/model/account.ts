// TODO - Refactor Past txs query
import { DEFAULT_TX_FILTERS } from "lib/data";
import { useUserAssetInfos } from "lib/pages/account-details/data";
import { useCodeListCountByWalletAddress } from "lib/services/codeService";
import {
  useContractListCountByAdmin,
  useInstantiatedCountByUserQuery,
} from "lib/services/contractService";
import { useProposalsCountByWalletAddress } from "lib/services/proposalService";
import { useTxsCountByAddress } from "lib/services/txService";
import type { HumanAddr, Option } from "lib/types";

/**
 * @remark
 * Counts for stored codes, contract admin, contract instances, transactions, and opened proposals tables
 */
export const useAccountDetailsTableCounts = (
  walletAddress: HumanAddr,
  accountId: Option<number>
) => {
  const { data: codesCount, refetch: refetchCodesCount } =
    useCodeListCountByWalletAddress(walletAddress);
  const { data: contractsAdminCount, refetch: refetchContractsAdminCount } =
    useContractListCountByAdmin(walletAddress);
  const { data: contractsCount, refetch: refetchContractsCount } =
    useInstantiatedCountByUserQuery(walletAddress);
  const { data: proposalsCount, refetch: refetchProposalsCount } =
    useProposalsCountByWalletAddress(walletAddress);
  const { data: txsCount, isFetching: txCountFetching } = useTxsCountByAddress(
    undefined,
    accountId,
    "",
    DEFAULT_TX_FILTERS,
    undefined
  );

  const { totalData: assetsCount } = useUserAssetInfos(walletAddress);

  return {
    tableCounts: {
      codesCount,
      contractsAdminCount,
      contractsCount,
      txsCount,
      proposalsCount,
      assetsCount,
    },
    loadingState: {
      txCountLoading: txCountFetching,
    },
    refetchCodesCount,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchProposalsCount,
  };
};
