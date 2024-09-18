import type Big from "big.js";

import type { Order_By } from "lib/gql/graphql";
import { useAssetInfos } from "lib/services/assetService";
import { usePoolByPoolId, usePoolListQuery } from "lib/services/poolService";
import { big } from "lib/types";
import type {
  Option,
  Pool,
  PoolDetail,
  PoolTypeFilter,
  PoolWeight,
  Ratio,
  TokenWithValue,
} from "lib/types";
import { coinToTokenWithValue, divWithDefault, formatRatio } from "lib/utils";

export const usePools = (
  isSupported: boolean,
  poolType: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string,
  order: Order_By,
  offset: number,
  pageSize: number
): { pools: Option<Pool[]>; isLoading: boolean } => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: poolList, isLoading: isLoadingPoolList } = usePoolListQuery({
    isSupported,
    poolType,
    isSuperfluidOnly,
    search,
    order,
    offset,
    pageSize,
  });

  const data = poolList?.map<Pool>((pool) => ({
    id: pool.id,
    type: pool.type,
    isSuperfluid: pool.isSuperfluid,
    poolLiquidity: pool.poolLiquidity.map<TokenWithValue>((coin) =>
      coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
    ),
    contractAddress: pool.contractAddress,
  }));

  return {
    pools: data,
    isLoading: isLoadingAssetInfos || isLoadingPoolList,
  };
};

export const usePool = (
  poolId: number
): { pool: Option<PoolDetail>; isLoading: boolean } => {
  const { data: assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos({
    withPrices: true,
  });
  const { data: pool, isLoading: isLoadingPoolInfo } = usePoolByPoolId(poolId);

  if (!Number.isInteger(poolId) || poolId <= 0)
    return { pool: undefined, isLoading: false };

  if (!assetInfos || !pool)
    return {
      pool: undefined,
      isLoading: isLoadingAssetInfos || isLoadingPoolInfo,
    };
  const totalPoolWeight = pool.weight?.reduce(
    (acc, curr) => acc.add(curr.weight),
    big(0)
  );
  return {
    pool: {
      id: pool.id,
      type: pool.type,
      isSuperfluid: pool.isSuperfluid,
      isSupported: pool.isSupported,
      poolLiquidity: pool.poolLiquidity.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos)
      ),
      blockHeight: pool.blockHeight,
      creator: pool.creator,
      poolAddress: pool.poolAddress,
      swapFee: pool.swapFee,
      exitFee: pool.exitFee,
      futurePoolGovernor: pool.futurePoolGovernor,
      weight:
        pool.weight?.map<PoolWeight>((weight) => {
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
      smoothWeightChangeParams: pool.smoothWeightChangeParams,
      scalingFactors: pool.scalingFactors,
      scalingFactorController: pool.scalingFactorController,
      spreadFactor: pool.spreadFactor,
      tickSpacing: pool.tickSpacing,
      contractAddress: pool.contractAddress,
    },
    isLoading: false,
  };
};
