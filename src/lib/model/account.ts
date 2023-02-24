// TODO - Refactor Past txs query
import { useUserAssetInfos } from "lib/pages/account-details/data";
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
  const { data: codesCount, refetch: refetchCodes } =
    useCodeListCountByWalletAddress(walletAddress);
  const { data: contractsAdminCount, refetch: refetchContractsAdminCount } =
    useContractListCountByAdmin(walletAddress);
  const { data: contractsCount, refetch: refetchContractsCount } =
    useInstantiatedCountByUserQuery(walletAddress);
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

  const { supportedAssets, unsupportedAssets } =
    useUserAssetInfos(walletAddress);

  return {
    tableCounts: {
      codesCount,
      contractsAdminCount,
      contractsCount,
      countTxs,
      proposalCount,
      assetsCount:
        supportedAssets &&
        unsupportedAssets &&
        supportedAssets.length + unsupportedAssets.length,
    },
    refetchCodes,
    refetchContractsAdminCount,
    refetchContractsCount,
    refetchCountTxs,
    refetchProposalCount,
  };
};
