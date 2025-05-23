import type { BigSource } from "big.js";
import type {
  AssetInfos,
  MovePoolInfos,
  Option,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import big, { Big } from "big.js";
import { isUndefined } from "lodash";

import { getTokenLabel, toToken } from "./formatter";

export const calculateAssetValue = (
  amount: Token<BigSource>,
  price: USD<BigSource>
): USD<Big> => big(amount).mul(price) as USD<Big>;

export const isSupportedToken = (token: TokenWithValue) =>
  !isUndefined(token.price);

export const filterSupportedTokens = (tokens: Option<TokenWithValue[]>) =>
  (tokens ?? []).reduce<{
    supportedTokens: TokenWithValue[];
    unsupportedTokens: TokenWithValue[];
  }>(
    ({ supportedTokens, unsupportedTokens }, token) => {
      if (isSupportedToken(token)) supportedTokens.push(token);
      else unsupportedTokens.push(token);

      return { supportedTokens, unsupportedTokens };
    },
    {
      supportedTokens: [],
      unsupportedTokens: [],
    }
  );

export const coinToTokenWithValue = (
  denom: string,
  amount: string,
  assetInfos: Option<AssetInfos>,
  poolInfos?: MovePoolInfos
): TokenWithValue => {
  const tokenAmount = big(amount) as U<Token<Big>>;
  const assetInfo = assetInfos?.[denom];
  const movePoolInfo = poolInfos?.[denom];

  return movePoolInfo
    ? {
        amount: tokenAmount,
        denom,
        isLPToken: true,
        logo: movePoolInfo.logo,
        poolInfo: {
          coinA: {
            amount: tokenAmount.times(movePoolInfo.coinA.amountAPerShare) as U<
              Token<Big>
            >,
            denom: movePoolInfo.coinA.denom,
            precision: movePoolInfo.coinA.precision,
            symbol: movePoolInfo.coinA.symbol,
          },
          coinB: {
            amount: tokenAmount.times(movePoolInfo.coinB.amountBPerShare) as U<
              Token<Big>
            >,
            denom: movePoolInfo.coinB.denom,
            precision: movePoolInfo.coinB.precision,
            symbol: movePoolInfo.coinB.symbol,
          },
        },
        precision: movePoolInfo.precision,
        price: movePoolInfo.lpPricePerPShare,
        symbol: `${getTokenLabel(
          movePoolInfo.coinA.denom,
          movePoolInfo.coinA.symbol
        )}-${getTokenLabel(
          movePoolInfo.coinB.denom,
          movePoolInfo.coinB.symbol
        )}`,
        value: movePoolInfo.lpPricePerPShare
          ? calculateAssetValue(
              toToken(tokenAmount, movePoolInfo.precision),
              movePoolInfo.lpPricePerPShare
            )
          : undefined,
      }
    : {
        amount: tokenAmount,
        denom,
        isLPToken: false,
        logo: assetInfo?.logo as string,
        precision: assetInfo?.precision,
        price: assetInfo ? (big(assetInfo.price) as USD<Big>) : undefined,
        symbol: assetInfo?.symbol,
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
        amount: big(0) as U<Token<Big>>,
        denom: "",
        isLPToken: false,
        logo: undefined,
        precision: undefined,
        price: big(0) as USD<Big>,
        symbol: undefined,
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

  if (token1.symbol && token2.symbol)
    return token1.symbol.localeCompare(token2.symbol);
  if (token1.symbol && !token2.symbol) return -1;
  if (!token1.symbol && token2.symbol) return 1;

  return token1.denom.localeCompare(token2.denom);
};
