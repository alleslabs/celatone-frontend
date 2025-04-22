import type Big from "big.js";
import type { PoolsResponse } from "lib/services/types";
import type {
  Nullish,
  Option,
  Pool,
  PoolData,
  PoolTypeFilter,
  PoolWeight,
  Ratio,
  TokenWithValue,
} from "lib/types";

import { useAssetInfos } from "lib/services/assetService";
import { usePoolData, usePools } from "lib/services/pools";
import { big } from "lib/types";
import { coinToTokenWithValue, divWithDefault, formatRatio } from "lib/utils";

export const useDerivedPools = (
  limit: number,
  offset: number,
  isSupported: boolean,
  poolType: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string,
  isDesc: boolean,
  onSuccess?: (data: PoolsResponse) => void
): {
  isLoading: boolean;
  pools: Option<Pool[]>;
  totalCount: Option<number>;
} => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data, isLoading: isLoadingPoolList } = usePools(
    limit,
    offset,
    isSupported,
    poolType,
    isSuperfluidOnly,
    search,
    isDesc,
    { onSuccess }
  );

  return {
    isLoading: isLoadingAssetInfos || isLoadingPoolList,
    pools: data?.items.map<Pool>((pool) => ({
      contractAddress: pool.contractAddress,
      id: pool.id,
      isSuperfluid: pool.isSuperfluid,
      liquidity: pool.liquidity.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
      ),
      type: pool.type,
    })),
    totalCount: data?.total,
  };
};

export const useDerivedPoolData = (
  poolId: number
): { isLoading: boolean; pool: Nullish<PoolData> } => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: pool, isLoading: isLoadingPoolInfo } = usePoolData(poolId);

  if (!Number.isInteger(poolId) || poolId <= 0)
    return { isLoading: false, pool: undefined };

  if (!assetInfos || !pool)
    return {
      isLoading: isLoadingAssetInfos || isLoadingPoolInfo,
      pool: undefined,
    };
  if (!pool.info)
    return {
      isLoading: false,
      pool: null,
    };

  const totalPoolWeight = pool.info.weight?.reduce(
    (acc, curr) => acc.add(curr.weight),
    big(0)
  );
  return {
    isLoading: false,
    pool: {
      address: pool.info.address,
      contractAddress: pool.info.contractAddress,
      createdHeight: pool.info.createdHeight,
      creator: pool.info.creator,
      exitFee: pool.info.exitFee,
      futurePoolGovernor: pool.info.futurePoolGovernor,
      id: pool.info.id,
      isSuperfluid: pool.info.isSuperfluid,
      isSupported: pool.info.isSupported,
      liquidity: pool.info.liquidity.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
      ),
      scalingFactorController: pool.info.scalingFactorController,
      scalingFactors: pool.info.scalingFactors,
      smoothWeightChangeParams: pool.info.smoothWeightChangeParams,
      spreadFactor: pool.info.spreadFactor,
      swapFee: pool.info.swapFee,
      tickSpacing: pool.info.tickSpacing,
      type: pool.info.type,
      weight:
        pool.info.weight?.map<PoolWeight>((weight) => {
          const bigWeight = big(weight.weight);
          return {
            denom: weight.denom,
            percentWeight:
              totalPoolWeight && totalPoolWeight.gt(0)
                ? formatRatio(
                    divWithDefault(bigWeight, totalPoolWeight, 0) as Ratio<Big>
                  )
                : null,
            weight: bigWeight,
          };
        }) ?? null,
    },
  };
};
