import { UPPERBOUND_COUNT } from "lib/data";
import { useTxsByPoolIdTableCounts } from "lib/services/tx";

const handleUpperBound = (data: number | undefined) =>
  data !== undefined && data <= UPPERBOUND_COUNT
    ? data
    : `${UPPERBOUND_COUNT}+`;

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
    totalAllData: handleUpperBound(totalAllData),
    isTotalAllLoading,
    totalSwapData: handleUpperBound(totalSwapData),
    isTotalSwapLoading,
    totalClpData: handleUpperBound(totalClpData),
    isTotalClpLoading,
    totalLpData: handleUpperBound(totalLpData),
    isTotalLpLoading,
    totalBondingData: handleUpperBound(totalBondingData),
    isTotalBondingLoading,
    totalSuperfluidData: handleUpperBound(totalSuperfluidData),
    isTotalSuperfluidLoading,
    totalCollectData: handleUpperBound(totalCollectData),
    isTotalCollectLoading,
    totalMigrateData: handleUpperBound(totalMigrateData),
    isTotalMigrateLoading,
  };
};
