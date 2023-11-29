import type { BigSource } from "big.js";
import big, { Big } from "big.js";

import type { AssetInfosOpt } from "lib/services/assetService";
import type {
  MovePoolInfos,
  Option,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import { formatUTokenWithPrecision, getTokenLabel, toToken } from "./formatter";

export const calculateAssetValue = (
  amount: Token<BigSource>,
  price: USD<number>
): USD<Big> => big(amount).mul(price) as USD<Big>;

export const coinToTokenWithValue = (
  denom: string,
  amount: string,
  assetInfos: AssetInfosOpt,
  poolInfos?: MovePoolInfos
): TokenWithValue => {
  const tokenAmount = big(amount) as U<Token<Big>>;
  const assetInfo = assetInfos?.[denom];
  const movePoolInfo = poolInfos?.[denom];
  return movePoolInfo
    ? {
        isLPToken: true,
        denom,
        amount: tokenAmount,
        symbol: `${getTokenLabel(
          movePoolInfo.coinA.denom,
          movePoolInfo.coinA.symbol
        )}-${getTokenLabel(
          movePoolInfo.coinB.denom,
          movePoolInfo.coinB.symbol
        )}`,
        logo: movePoolInfo.logo,
        precision: movePoolInfo.precision,
        price: movePoolInfo.lpPricePerShare,
        value: movePoolInfo.lpPricePerShare
          ? (tokenAmount
              .times(movePoolInfo.lpPricePerShare)
              .div(big(10).pow(movePoolInfo.precision)) as USD<Big>)
          : undefined,
        poolInfo: {
          coinA: {
            amount: formatUTokenWithPrecision(
              tokenAmount.times(movePoolInfo.coinA.amountAPerShare) as U<
                Token<Big>
              >,
              movePoolInfo.precision
            ),
            denom: movePoolInfo.coinA.denom,
            symbol: movePoolInfo.coinA.symbol,
          },
          coinB: {
            amount: formatUTokenWithPrecision(
              tokenAmount.times(movePoolInfo.coinB.amountBPerShare) as U<
                Token<Big>
              >,
              movePoolInfo.precision
            ),
            denom: movePoolInfo.coinB.denom,
            symbol: movePoolInfo.coinB.symbol,
          },
        },
      }
    : {
        isLPToken: false,
        denom,
        amount: tokenAmount,
        symbol: assetInfo?.symbol,
        logo: assetInfo?.logo as string,
        precision: assetInfo?.precision,
        price: assetInfo ? (big(assetInfo.price) as USD<Big>) : undefined,
        value: assetInfo
          ? calculateAssetValue(
              toToken(tokenAmount, assetInfo.precision),
              assetInfo.price as USD<number>
            )
          : undefined,
      };
};

export const addTokenWithValue = (
  oldToken: Option<TokenWithValue>,
  token: TokenWithValue
): TokenWithValue => {
  if (!oldToken) return token;
  return oldToken.denom === token.denom
    ? {
        ...oldToken,
        amount: oldToken.amount.add(token.amount) as U<Token<Big>>,
        value: oldToken.value?.add(token.value ?? 0) as USD<Big>,
      }
    : {
        isLPToken: false,
        denom: "",
        amount: big(0) as U<Token<Big>>,
        symbol: undefined,
        logo: undefined,
        precision: undefined,
        price: big(0) as USD<Big>,
        value: big(0) as USD<Big>,
      };
};

export const totalValueTokenWithValue = (
  tokens: Record<string, TokenWithValue> | TokenWithValue[],
  defaultValue: USD<Big>
) =>
  Object.values(tokens).reduce(
    (acc, token) => acc.add(token.value ?? defaultValue),
    Big(0)
  ) as USD<Big>;

export const compareTokenWithValues = (
  token1: TokenWithValue,
  token2: TokenWithValue
) => {
  if (token1.value && token2.value) return token2.value.cmp(token1.value);
  if (token1.value && !token2.value) return -1;
  if (!token1.value && token2.value) return 1;
  return token1.denom.localeCompare(token2.denom);
};
