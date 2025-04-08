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
  pools: Option<Pool[]>;
  totalCount: Option<number>;
  isLoading: boolean;
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
    pools: data?.items.map<Pool>((pool) => ({
      id: pool.id,
      type: pool.type,
      isSuperfluid: pool.isSuperfluid,
      liquidity: pool.liquidity.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
      ),
      contractAddress: pool.contractAddress,
    })),
    totalCount: data?.total,
    isLoading: isLoadingAssetInfos || isLoadingPoolList,
  };
};

export const useDerivedPoolData = (
  poolId: number
): { pool: Nullish<PoolData>; isLoading: boolean } => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: pool, isLoading: isLoadingPoolInfo } = usePoolData(poolId);

  if (!Number.isInteger(poolId) || poolId <= 0)
    return { pool: undefined, isLoading: false };

  if (!assetInfos || !pool)
    return {
      pool: undefined,
      isLoading: isLoadingAssetInfos || isLoadingPoolInfo,
    };
  if (!pool.info)
    return {
      pool: null,
      isLoading: false,
    };

  const totalPoolWeight = pool.info.weight?.reduce(
    (acc, curr) => acc.add(curr.weight),
    big(0)
  );
  return {
    pool: {
      id: pool.info.id,
      type: pool.info.type,
      isSuperfluid: pool.info.isSuperfluid,
      isSupported: pool.info.isSupported,
      liquidity: pool.info.liquidity.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
      ),
      createdHeight: pool.info.createdHeight,
      creator: pool.info.creator,
      address: pool.info.address,
      swapFee: pool.info.swapFee,
      exitFee: pool.info.exitFee,
      futurePoolGovernor: pool.info.futurePoolGovernor,
      weight:
        pool.info.weight?.map<PoolWeight>((weight) => {
          const bigWeight = big(weight.weight);
          return {
            denom: weight.denom,
            weight: bigWeight,
            percentWeight:
              totalPoolWeight && totalPoolWeight.gt(0)
                ? formatRatio(
                    divWithDefault(bigWeight, totalPoolWeight, 0) as Ratio<Big>
                  )
                : null,
          };
        }) ?? null,
      smoothWeightChangeParams: pool.info.smoothWeightChangeParams,
      scalingFactors: pool.info.scalingFactors,
      scalingFactorController: pool.info.scalingFactorController,
      spreadFactor: pool.info.spreadFactor,
      tickSpacing: pool.info.tickSpacing,
      contractAddress: pool.info.contractAddress,
    },
    isLoading: false,
  };
};
