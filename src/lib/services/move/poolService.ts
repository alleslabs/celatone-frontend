import { useQuery } from "@tanstack/react-query";
import type Big from "big.js";

import { useAssetInfos } from "../assetService";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useMoveConfig,
} from "lib/app-provider";
import { big } from "lib/types";
import type { MovePoolInfos, Option, Token, U, USD } from "lib/types";
import { calculateAssetValue, toToken } from "lib/utils";

import { getMovePoolInfos } from "./pool";

const computePricePerPShare = (
  amountAPerShare: Token<Big>,
  weightA: string,
  priceA: Option<number>,
  amountBPerShare: Token<Big>,
  weightB: string,
  priceB: Option<number>,
  poolPrecision: number
): Option<USD<Big>> => {
  const multiplier = big(10).pow(poolPrecision);
  if (priceA && priceB)
    return calculateAssetValue(amountAPerShare, priceA as USD<number>)
      .plus(calculateAssetValue(amountBPerShare, priceB as USD<number>))
      .times(multiplier) as USD<Big>;

  const totalWeight = big(weightA).plus(weightB);
  if (priceA && big(weightA).gt(0))
    return calculateAssetValue(amountAPerShare, priceA as USD<number>)
      .times(totalWeight.div(weightA))
      .times(multiplier) as USD<Big>;
  if (priceB && big(weightB).gt(0))
    return calculateAssetValue(amountBPerShare, priceB as USD<number>)
      .times(totalWeight.div(weightB))
      .times(multiplier) as USD<Big>;

  return undefined;
};

export const useMovePoolInfos = ({ withPrices }: { withPrices: boolean }) => {
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const moveEndpoint = useBaseApiRoute("move");

  const {
    data: assetInfos,
    isLoading: isAssetsLoading,
    error: assetsErrors,
  } = useAssetInfos({ withPrices });
  const {
    data: pools,
    isFetching: isPoolsFetching,
    error: poolsErrors,
    ...queryResult
  } = useQuery(
    [CELATONE_QUERY_KEYS.MOVE_POOL_INFOS, moveEndpoint],
    async () => getMovePoolInfos(moveEndpoint),
    {
      enabled: moveConfig.enabled,
      refetchOnWindowFocus: false,
    }
  );

  const data = pools?.reduce<MovePoolInfos>((acc, curr) => {
    const coinAInfo = assetInfos?.[curr.coin_a.denom];
    const coinBInfo = assetInfos?.[curr.coin_b.denom];

    const totalShares = big(curr.total_share);
    const [tempA, tempB] = totalShares.eq(0)
      ? [big(0), big(0)]
      : [
          big(curr.coin_a.amount).div(totalShares),
          big(curr.coin_b.amount).div(totalShares),
        ];
    const [amountAPerShare, amountBPerShare] = [tempA, tempB] as [
      U<Token<Big>>,
      U<Token<Big>>,
    ];

    const lpPricePerPShare = computePricePerPShare(
      toToken(amountAPerShare, coinAInfo?.precision ?? 0),
      curr.coin_a.weight,
      coinAInfo?.price,
      toToken(amountBPerShare, coinBInfo?.precision ?? 0),
      curr.coin_b.weight,
      coinBInfo?.price,
      curr.precision
    );

    return {
      ...acc,
      [curr.lp_denom]: {
        coinA: {
          ...curr.coin_a,
          amountAPerShare,
          precision: coinAInfo?.precision,
          symbol: coinAInfo?.symbol,
        },
        coinB: {
          ...curr.coin_b,
          amountBPerShare,
          precision: coinBInfo?.precision,
          symbol: coinBInfo?.symbol,
        },
        precision: curr.precision,
        lpPricePerPShare,
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
