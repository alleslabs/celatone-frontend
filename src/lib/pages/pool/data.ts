import big from "big.js";

import type { Order_By } from "lib/gql/graphql";
import { useAssetInfos } from "lib/services/assetService";
import {
  usePoolByPoolId,
  usePoolListByIsSupported,
} from "lib/services/poolService";
import type { Option } from "lib/types";

import { coinToTokenWithValue } from "./type";
import type {
  PoolCardData,
  PoolData,
  PoolWeight,
  TokenWithValue,
} from "./type";

export const usePools = (
  isSupported: boolean,
  isSuperfluidOnly: boolean,
  search: string,
  order: Order_By,
  offset: number,
  pageSize: number
): { pools: Option<PoolCardData[]>; isLoading: boolean } => {
  const { assetInfos, isLoading: isLoadingAssetInfos } = useAssetInfos();
  const { data: poolList, isLoading: isLoadingPoolList } =
    usePoolListByIsSupported(
      isSupported,
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

  const data = poolList.map<PoolCardData>((pool) => ({
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
): { pool: Option<PoolData>; isLoading: boolean } => {
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
      weight: pool.weight?.map<PoolWeight>((weight) => ({
        denom: weight.denom,
        weight: big(weight.weight),
      })),
      smoothWeightChangeParams: pool.smoothWeightChangeParams,
      scalingFactors: pool.scalingFactors,
      scalingFactorController: pool.scalingFactorController,
    },
    isLoading: false,
  };
};
