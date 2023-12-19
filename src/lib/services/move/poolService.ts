import { useQuery } from "@tanstack/react-query";
import type { Big } from "big.js";
import big from "big.js";

import { useAssetInfos } from "../assetService";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useMoveConfig,
} from "lib/app-provider";
import type { MovePoolInfos, Option, USD } from "lib/types";

import { getMovePoolInfos } from "./pool";

const computePricePerShare = (
  amountAPerShare: Big,
  weightA: string,
  priceA: Option<number>,
  amountBPerShare: Big,
  weightB: string,
  priceB: Option<number>
): Option<USD<Big>> => {
  if (priceA && priceB)
    return big(priceA)
      .times(amountAPerShare)
      .plus(big(priceB).times(amountBPerShare)) as USD<Big>;
  if (priceA)
    return big(priceA)
      .times(amountAPerShare)
      .times(big(weightA).plus(weightB).div(weightA)) as USD<Big>;
  if (priceB)
    return big(priceB)
      .times(amountBPerShare)
      .times(big(weightA).plus(weightB).div(weightB)) as USD<Big>;
  return undefined;
};

// TODO: add withPrices option
export const useMovePoolInfos = () => {
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const moveEndpoint = useBaseApiRoute("move");

  const {
    data: assetInfos,
    isLoading: isAssetsLoading,
    error: assetsErrors,
  } = useAssetInfos({ withPrices: true });
  const {
    data: pools,
    isFetching: isPoolsFetching,
    error: poolsErrors,
    ...queryResult
  } = useQuery(
    [CELATONE_QUERY_KEYS.MOVE_POOL_INFOS, moveEndpoint],
    async () => getMovePoolInfos(moveEndpoint),
    {
      enabled: moveConfig.enabled && moveConfig.hasPools,
      refetchOnWindowFocus: false,
    }
  );

  const data = pools?.reduce<MovePoolInfos>((acc, curr) => {
    const coinAInfo = assetInfos?.[curr.coin_a.denom];
    const coinAprecision = coinAInfo?.precision ?? 0;
    const coinBInfo = assetInfos?.[curr.coin_b.denom];
    const coinBprecision = coinBInfo?.precision ?? 0;

    const totalShares = big(curr.total_share).div(big(10).pow(curr.precision));
    const [amountAPerShare, amountBPerShare] = totalShares.eq(0)
      ? [big(0), big(0)]
      : [
          big(curr.coin_a.amount)
            .div(big(10).pow(coinAprecision))
            .div(totalShares),
          big(curr.coin_b.amount)
            .div(big(10).pow(coinBprecision))
            .div(totalShares),
        ];

    const lpPricePerShare = computePricePerShare(
      amountAPerShare,
      curr.coin_a.weight,
      coinAInfo?.price,
      amountBPerShare,
      curr.coin_b.weight,
      coinBInfo?.price
    );

    return {
      ...acc,
      [curr.lp_denom]: {
        coinA: {
          ...curr.coin_a,
          precision: coinAprecision,
          amountAPerShare,
          symbol: coinAInfo?.symbol,
        },
        coinB: {
          ...curr.coin_b,
          precision: coinBprecision,
          amountBPerShare,
          symbol: coinBInfo?.symbol,
        },
        precision: curr.precision,
        lpPricePerShare,
        logo: [coinAInfo?.logo, coinBInfo?.logo],
      },
    };
  }, {});

  return {
    ...queryResult,
    isLoading: isAssetsLoading || isPoolsFetching,
    error: assetsErrors ?? poolsErrors,
    data,
  };
};
