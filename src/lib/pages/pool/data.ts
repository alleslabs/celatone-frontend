import type { Big } from "big.js";
import big from "big.js";

import type { Order_By } from "lib/gql/graphql";
import { useAssetInfos } from "lib/services/assetService";
import {
  usePoolByPoolId,
  usePoolListByIsSupported,
} from "lib/services/poolService";
import type {
  Option,
  Pool,
  PoolDetail,
  PoolTypeFilter,
  PoolWeight,
  TokenWithValue,
} from "lib/types";
import { coinToTokenWithValue } from "lib/utils";

export const usePools = (
  isSupported: boolean,
  poolType: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string,
  order: Order_By,
  offset: number,
  pageSize: number
): { pools: Option<Pool[]>; isLoading: boolean } => {
  const { assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos();
  const { data: poolList, isLoading: isLoadingPoolList } =
    usePoolListByIsSupported(
      isSupported,
      poolType,
      isSuperfluidOnly,
      search,
      order,
      offset,
      pageSize
    );

  if (!assetInfos || !poolList)
    return {
      pools: undefined,
      isLoading: isLoadingAssetInfos || isLoadingPoolList,
    };

  const data = poolList.map<Pool>((pool) => ({
    id: pool.id,
    type: pool.type,
    isSuperfluid: pool.isSuperfluid,
    poolLiquidity: pool.poolLiquidity.map<TokenWithValue>((coin) =>
      coinToTokenWithValue(coin.denom, coin.amount, assetInfos[coin.denom])
    ),
  }));

  return {
    pools: data,
    isLoading: false,
  };
};

export const usePool = (
  poolId: number
): { pool: Option<PoolDetail<Big, TokenWithValue>>; isLoading: boolean } => {
  const { assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos();
  const { data: pool, isLoading: isLoadingPoolInfo } = usePoolByPoolId(poolId);

  if (!assetInfos || !pool)
    return {
      pool: undefined,
      isLoading: isLoadingAssetInfos || isLoadingPoolInfo,
    };

  return {
    pool: {
      id: pool.id,
      type: pool.type,
      isSuperfluid: pool.isSuperfluid,
      isSupported: pool.isSupported,
      poolLiquidity: pool.poolLiquidity.map<TokenWithValue>((coin) =>
        coinToTokenWithValue(coin.denom, coin.amount, assetInfos[coin.denom])
      ),
      blockHeight: pool.blockHeight,
      creator: pool.creator,
      poolAddress: pool.poolAddress,
      swapFee: pool.swapFee,
      exitFee: pool.exitFee,
      futurePoolGovernor: pool.futurePoolGovernor,
      weight:
        pool.weight?.map<PoolWeight>((weight) => ({
          denom: weight.denom,
          weight: big(weight.weight),
        })) ?? null,
      smoothWeightChangeParams: pool.smoothWeightChangeParams,
      scalingFactors: pool.scalingFactors,
      scalingFactorController: pool.scalingFactorController,
    },
    isLoading: false,
  };
};
