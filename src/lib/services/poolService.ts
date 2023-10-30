import type { Coin } from "@cosmjs/stargate";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { Big } from "big.js";
import big from "big.js";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useLCDEndpoint,
} from "lib/app-provider";
import type { Order_By } from "lib/gql/graphql";
import {
  getPoolByPoolId,
  getPoolList,
  getPoolListByDenoms,
  getPoolListByDenomsCount,
  getPoolListCount,
  getPoolsByPoolIds,
} from "lib/query";
import type {
  ContractAddr,
  HexAddr,
  Option,
  Pool,
  PoolDetail,
  PoolTypeFilter,
} from "lib/types";
import { isPositiveInt, parseJsonStr } from "lib/utils";

import { useAssetInfos } from "./assetService";
import { usePoolExpression } from "./expression/poolExpression";
import type { IndexedModule } from "./move";
import { useAccountModules, getFunctionView } from "./move";

export const usePoolListQuery = ({
  isSupported,
  poolType,
  isSuperfluidOnly,
  search,
  order,
  offset,
  pageSize,
}: {
  isSupported: boolean;
  poolType: PoolTypeFilter;
  isSuperfluidOnly: boolean;
  search: string;
  order: Order_By;
  offset: number;
  pageSize: number;
}): UseQueryResult<Pool<Coin>[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolExpression(
    isSupported,
    poolType,
    isSuperfluidOnly,
    search
  );

  const queryFn = useCallback(async () => {
    const request =
      !search || isPositiveInt(search)
        ? indexerGraphClient.request(getPoolList, {
            expression,
            order,
            offset,
            pageSize,
          })
        : indexerGraphClient.request(getPoolListByDenoms, {
            denoms: search,
            expression,
            order,
            offset,
            pageSize,
          });
    return request.then(({ pools }) =>
      pools.map<Pool<Coin>>((pool) => ({
        id: pool.id,
        type: pool.type,
        isSuperfluid: pool.is_superfluid,
        poolLiquidity: pool.liquidity,
        contractAddress: pool.contract_address as ContractAddr,
      }))
    );
  }, [expression, indexerGraphClient, offset, order, pageSize, search]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_LIST,
      isSupported,
      poolType,
      isSuperfluidOnly,
      search,
      order,
      offset,
      pageSize,
      indexerGraphClient,
    ],
    queryFn
  );
};

export const usePoolListCountQuery = ({
  isSupported,
  poolType,
  isSuperfluidOnly,
  search,
}: {
  isSupported: boolean;
  poolType: PoolTypeFilter;
  isSuperfluidOnly: boolean;
  search: string;
}): UseQueryResult<number> => {
  const { indexerGraphClient } = useCelatoneApp();
  const expression = usePoolExpression(
    isSupported,
    poolType,
    isSuperfluidOnly,
    search
  );

  const queryFn = useCallback(async () => {
    const request =
      !search || isPositiveInt(search)
        ? indexerGraphClient.request(getPoolListCount, {
            expression,
          })
        : indexerGraphClient.request(getPoolListByDenomsCount, {
            denoms: search,
            expression,
          });

    return request.then(
      ({ pools_aggregate }) => pools_aggregate.aggregate?.count
    );
  }, [expression, indexerGraphClient, search]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_LIST_COUNT,
      isSupported,
      poolType,
      isSuperfluidOnly,
      search,
      indexerGraphClient,
    ],
    queryFn
  );
};

export const usePoolByPoolId = (
  poolId: number,
  enabled = true
): UseQueryResult<PoolDetail<string, Coin>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!poolId) throw new Error("Pool ID is undefined.");
    return indexerGraphClient
      .request(getPoolByPoolId, {
        poolId,
      })
      .then(({ pools_by_pk }) =>
        // TODO: revisit to remove this assertion later
        pools_by_pk
          ? ({
              id: pools_by_pk.id,
              type: pools_by_pk.type,
              isSuperfluid: pools_by_pk.is_superfluid,
              isSupported: pools_by_pk.is_supported,
              poolLiquidity: pools_by_pk.liquidity,
              blockHeight: pools_by_pk.transaction?.block_height,
              creator: pools_by_pk.account?.address,
              poolAddress: pools_by_pk.address,
              swapFee: pools_by_pk.swap_fee,
              exitFee: pools_by_pk.exit_fee,
              futurePoolGovernor: pools_by_pk.future_pool_governor,
              weight: pools_by_pk.weight,
              smoothWeightChangeParams: pools_by_pk.smooth_weight_change_params,
              scalingFactors: pools_by_pk.scaling_factors,
              scalingFactorController: pools_by_pk.scaling_factor_controller,
              spreadFactor: pools_by_pk.spread_factor,
              tickSpacing: pools_by_pk.tick_spacing,
              contractAddress: pools_by_pk.contract_address,
            } as PoolDetail<string, Coin>)
          : undefined
      );
  }, [poolId, indexerGraphClient]);

  return useQuery(
    [CELATONE_QUERY_KEYS.POOL_INFO_BY_ID, poolId, indexerGraphClient],
    queryFn,
    {
      enabled,
    }
  );
};

export const usePoolAssetsbyPoolIds = (
  poolIds: number[],
  enabled = true
): UseQueryResult<Record<number, string[]>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getPoolsByPoolIds, {
        poolIds,
      })
      .then(({ pools }) =>
        pools.reduce<Record<number, string[]>>(
          (prev, pool) => ({
            ...prev,
            [pool.id]: (pool.liquidity as Coin[]).map(
              (liquidity) => liquidity.denom
            ),
          }),
          {}
        )
      );
  }, [poolIds, indexerGraphClient]);

  return useQuery(
    [CELATONE_QUERY_KEYS.POOL_INFO_BY_IDS, poolIds, indexerGraphClient],
    queryFn,
    {
      enabled,
    }
  );
};

interface PairRaw {
  coin_a: {
    metadata: string;
    denom: string;
    decimals: number;
  };
  coin_b: {
    metadata: string;
    denom: string;
    decimals: number;
  };
  liquidity_token: {
    metadata: string;
    denom: string;
    decimals: number;
  };
  coin_a_weight: string;
  coin_b_weight: string;
  coin_a_amount: string;
  coin_b_amount: string;
  total_share: string;
}

interface PairResponse {
  coin_a: {
    denom: string;
    tag: HexAddr;
    weight: string;
    amount: string;
  };
  coin_b: {
    denom: string;
    tag: HexAddr;
    weight: string;
    amount: string;
  };
  lp_denom: string;
  lp_tag: HexAddr;
  decimals: number;
  total_share: string;
}

export type LPShareInfoMap = Record<
  string,
  {
    coinA: {
      symbol: string;
      denom: string;
      precision: number;
      tag: HexAddr;
      amountAPerShare: Big;
    };
    coinB: {
      symbol: string;
      denom: string;
      precision: number;
      tag: HexAddr;
      amountBPerShare: Big;
    };
    lpPricePerShare: Big;
    precision: number;
    image: [string, string];
    symbol: string;
  }
>;

const indexPairResponse = (res: string): PairResponse[] => {
  const parsed = parseJsonStr<PairRaw[]>(res);
  return parsed.map((raw) => ({
    coin_a: {
      denom: raw.coin_a.denom,
      tag: raw.coin_a.metadata as HexAddr,
      weight: raw.coin_a_weight,
      amount: raw.coin_a_amount,
    },
    coin_b: {
      denom: raw.coin_b.denom,
      tag: raw.coin_b.metadata as HexAddr,
      weight: raw.coin_b_weight,
      amount: raw.coin_b_amount,
    },
    lp_denom: raw.liquidity_token.denom,
    lp_tag: raw.liquidity_token.metadata as HexAddr,
    decimals: raw.liquidity_token.decimals,
    total_share: raw.total_share,
  }));
};

export const useLPShareInfo = () => {
  const { data: moduleData } = useAccountModules({
    address: "0xa36bd0a54fad4bd931c4c00e3e74815f99a6c6b4" as HexAddr,
    moduleName: "PoolInfo",
    functionName: "get_all_pair_infos",
    options: { refetchOnWindowFocus: false, staleTime: Infinity },
  });
  const { assetInfos } = useAssetInfos({ withPrices: true });
  const lcdEndpoint = useLCDEndpoint();

  const poolInfoModule = moduleData as Option<IndexedModule>;

  const queryFn = async () => {
    if (!poolInfoModule?.searchedFn || !assetInfos)
      throw new Error(
        "Error fetching module, asset infos or dex functions not found."
      );
    const pairs = await getFunctionView(
      lcdEndpoint,
      poolInfoModule.address,
      poolInfoModule.moduleName,
      poolInfoModule.searchedFn,
      {
        typeArgs: {},
        args: {},
      }
    ).then((res) => indexPairResponse(res));

    return pairs.reduce<LPShareInfoMap>((acc, curr) => {
      const [coinA, coinB] = [curr.coin_a.denom, curr.coin_b.denom].map(
        (denom, idx) => ({
          ...(idx === 0 ? curr.coin_a : curr.coin_b),
          ...assetInfos[denom],
        })
      );

      const totalShares = big(curr.total_share).div(big(10).pow(curr.decimals));
      const amountAPerShare = big(curr.coin_a.amount)
        .div(big(10).pow(coinA.precision))
        .div(totalShares);
      const amountBPerShare = big(curr.coin_b.amount)
        .div(big(10).pow(coinB.precision))
        .div(totalShares);

      const lpPricePerShare = (() => {
        if (coinA.price && coinB.price) {
          return big(coinA.price)
            .times(amountAPerShare)
            .plus(big(coinB.price).times(amountBPerShare));
        }
        if (coinA.price) {
          return big(coinA.price)
            .times(amountAPerShare)
            .times(big(coinA.weight).plus(coinB.weight).div(coinA.weight));
        }
        if (coinB.price) {
          return big(coinB.price)
            .times(amountBPerShare)
            .times(big(coinA.weight).plus(coinB.weight).div(coinB.weight));
        }
        return big(0);
      })();
      return {
        ...acc,
        [curr.lp_denom]: {
          coinA: {
            symbol: coinA.symbol,
            denom: coinA.denom,
            precision: coinA.precision,
            tag: coinA.tag,
            amountAPerShare,
          },
          coinB: {
            symbol: coinB.symbol,
            denom: coinB.denom,
            precision: coinB.precision,
            tag: coinA.tag,
            amountBPerShare,
          },
          lpPricePerShare,
          precision: curr.decimals,
          image: [coinA.logo, coinB.logo],
          symbol: `${coinA.symbol}-${coinB.symbol}`,
        },
      };
    }, {});
  };
  return useQuery(
    [
      CELATONE_QUERY_KEYS.POOL_MOVE_LP_SHARE_INFO,
      poolInfoModule,
      assetInfos,
      lcdEndpoint,
    ],
    queryFn,
    {
      enabled: Boolean(poolInfoModule?.searchedFn && assetInfos),
      refetchOnWindowFocus: false,
    }
  );
};
