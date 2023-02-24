// TODO - Refactor Past txs query
import { useTxQueryCount } from "lib/pages/past-txs/query/useTxQuery";
import { useCodeListCountByWalletAddress } from "lib/services/codeService";
import {
  useContractListCountByAdmin,
  useInstantiatedCountByUserQuery,
} from "lib/services/contractService";
import { useProposalsCountByWalletAddress } from "lib/services/proposalService";
import type { HumanAddr } from "lib/types";

/**
 * @remark
 * Counts for stored codes, contract admin, contract instances, transactions, and opened proposals tables
 */
export const useAccountDetailsTableCounts = (walletAddress: HumanAddr) => {
  const { data: codesCount, refetch: refetchCodesCount } =
    useCodeListCountByWalletAddress(walletAddress);
  const { data: contractsAdminCount, refetch: refetchContractsAdminCount } =
    useContractListCountByAdmin(walletAddress);
  const { data: contractsCount, refetch: refetchContractsCount } =
    useInstantiatedCountByUserQuery(walletAddress);
  const { data: proposalsCount, refetch: refetchProposalsCount } =
    useProposalsCountByWalletAddress(walletAddress);
  const { data: countTxs, refetch: refetchCountTxs } = useTxQueryCount(
    walletAddress,
    "",
    {
      isExecute: false,
      isInstantiate: false,
      isUpload: false,
      isIbc: false,
      isSend: false,
      isMigrate: false,
      isUpdateAdmin: false,
      isClearAdmin: false,
    }
  );

  return {
    tableCounts: {
      codesCount,
      contractsAdminCount,
      contractsCount,
      countTxs,
      proposalsCount,
    },
    refetchCodesCount,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchCountTxs,
    refetchProposalsCount,
  };
};
