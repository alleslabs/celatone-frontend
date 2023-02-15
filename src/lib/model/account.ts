import { useWallet } from "@cosmos-kit/react";

import { useTxQueryCount } from "lib/pages/past-txs/query/useTxQuery";
import { useCodeListCountByWalletAddressWithPagination } from "lib/services/codeService";
import {
  useContractListCountByAdminWithPagination,
  useContractListCountByWalletAddressWithPagination,
} from "lib/services/contractService";
import { useProposalsCountByUserAddress } from "lib/services/proposalService";
import type { HumanAddr } from "lib/types";

/**
 * @remark
 * Counts for stored codes, contract admin, contract instances, transactions, and opened proposals tables
 */
export const useAccountDetailsTableCounts = () => {
  const { address } = useWallet();
  const humanAddress = address as HumanAddr;
  const { data: codesCount, refetch: refetchCodes } =
    useCodeListCountByWalletAddressWithPagination(humanAddress);
  const { data: contractsAdminCount, refetch: refetchContractsAdminCount } =
    useContractListCountByAdminWithPagination(humanAddress);
  const { data: contractsCount, refetch: refetchContractsCount } =
    useContractListCountByWalletAddressWithPagination(humanAddress);
  const { data: proposalCount, refetch: refetchProposalCount } =
    useProposalsCountByUserAddress(humanAddress);
  const { data: countTxs, refetch: refetchCountTxs } = useTxQueryCount(
    address,
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
