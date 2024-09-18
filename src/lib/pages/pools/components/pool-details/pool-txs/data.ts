import { useTxsByPoolIdTableCounts } from "lib/services/tx";

export const usePoolTxsTableCounts = (poolId: number) => {
  const { data: totalAllData, isLoading: isTotalAllLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_all");

  const { data: totalSwapData, isLoading: isTotalSwapLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_swap");

  const { data: totalClpData, isLoading: isTotalClpLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_clp");

  const { data: totalLpData, isLoading: isTotalLpLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_lp");

  const { data: totalBondingData, isLoading: isTotalBondingLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_bond");

  const { data: totalSuperfluidData, isLoading: isTotalSuperfluidLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_superfluid");

  const { data: totalCollectData, isLoading: isTotalCollectLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_collect");

  const { data: totalMigrateData, isLoading: isTotalMigrateLoading } =
    useTxsByPoolIdTableCounts(poolId, "is_migrate");

  return {
    totalAllData,
    isTotalAllLoading,
    totalSwapData,
    isTotalSwapLoading,
    totalClpData,
    isTotalClpLoading,
    totalLpData,
    isTotalLpLoading,
    totalBondingData,
    isTotalBondingLoading,
    totalSuperfluidData,
    isTotalSuperfluidLoading,
    totalCollectData,
    isTotalCollectLoading,
    totalMigrateData,
    isTotalMigrateLoading,
  };
};
