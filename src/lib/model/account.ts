import { useTxQueryCount } from "lib/pages/past-txs/query/useTxQuery";
import { useCodeListCountByWalletAddress } from "lib/services/codeService";
import {
  useContractListCountByAdmin,
  useContractListCountByWalletAddress,
} from "lib/services/contractService";
import { useProposalsCountByWalletAddress } from "lib/services/proposalService";
import type { HumanAddr, Option } from "lib/types";

/**
 * @remark
 * Counts for stored codes, contract admin, contract instances, transactions, and opened proposals tables
 */
export const useAccountDetailsTableCounts = (
  walletAddress: Option<HumanAddr>
) => {
  const { data: codesCount, refetch: refetchCodes } =
    useCodeListCountByWalletAddress(walletAddress);
  const { data: contractsAdminCount, refetch: refetchContractsAdminCount } =
    useContractListCountByAdmin(walletAddress);
  const { data: contractsCount, refetch: refetchContractsCount } =
    useContractListCountByWalletAddress(walletAddress);
  const { data: proposalCount, refetch: refetchProposalCount } =
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
      proposalCount,
    },
    refetchCodes,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchCountTxs,
    refetchProposalCount,
  };
};
