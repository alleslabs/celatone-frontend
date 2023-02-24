// TODO - Refactor Past txs query
import { DEFAULT_TX_FILTERS } from "lib/data";
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
  const { data: proposalCount, refetch: refetchProposalCount } =
    useProposalsCountByWalletAddress(walletAddress);
  const { data: txsCount, refetch: refetchTxsCount } = useTxQueryCount(
    walletAddress,
    "",
    DEFAULT_TX_FILTERS
  );

  return {
    tableCounts: {
      codesCount,
      contractsAdminCount,
      contractsCount,
      txsCount,
      proposalCount,
    },
    refetchCodesCount,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchTxsCount,
    refetchProposalCount,
  };
};
