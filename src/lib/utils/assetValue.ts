import type { BigSource } from "big.js";
import big, { Big } from "big.js";

import type { AssetInfosOpt } from "lib/services/assetService";
import type {
  LPShareInfoMap,
  LPShareInfoReturn,
} from "lib/services/poolService";
import type {
  Balance,
  BalanceWithAssetInfo,
  Option,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import { formatUTokenWithPrecision, toToken } from "./formatter";

export const calculateAssetValue = (
  amount: Token<BigSource>,
  price: USD<number>
): USD<Big> => big(amount).mul(price) as USD<Big>;

export const calAssetValueWithPrecision = (balance: Balance): USD<Big> => {
  if (Number.isNaN(Number(balance.amount)) || !balance.amount.trim().length)
    throw new Error("Error balance amount is not a number");

  if (balance.price) {
    return calculateAssetValue(
      toToken(balance.amount.trim() as U<Token>, balance.precision),
      balance.price as USD<number>
    );
  }
  return big(0) as USD<Big>;
};

export const calTotalValue = (assets: BalanceWithAssetInfo[]): USD<Big> =>
  assets.reduce(
    (acc: USD<Big>, curr: BalanceWithAssetInfo) =>
      acc.add(calAssetValueWithPrecision(curr.balance)) as USD<Big>,
    big(0) as USD<Big>
  );

type LPDetailsReturn =
  | { isLPToken: true; lpDetails: LPShareInfoReturn }
  | { isLPToken: false; lpDetails: undefined };

export const getLPDetails = (
  denom: string,
  lpMap: LPShareInfoMap = {}
): LPDetailsReturn => {
  const isLPToken = denom in lpMap;
  return isLPToken
    ? { isLPToken: true, lpDetails: lpMap[denom] }
    : { isLPToken: false, lpDetails: undefined };
};

export const coinToTokenWithValue = (
  denom: string,
  amount: string,
  assetInfos: AssetInfosOpt,
  lpMap?: LPShareInfoMap
): TokenWithValue => {
  const tokenAmount = big(amount) as U<Token<Big>>;
  const assetInfo = assetInfos?.[denom];
  const { isLPToken, lpDetails } = getLPDetails(denom, lpMap);
  return isLPToken
    ? {
        isLPToken,
        denom,
        amount: tokenAmount,
        symbol: lpDetails.symbol,
        logo: lpDetails.image,
        precision: lpDetails.precision,
        lpDetails: {
          coinA: {
            amount: formatUTokenWithPrecision(
              tokenAmount.times(lpDetails.coinA.amountAPerShare) as U<
                Token<Big>
              >,
              lpDetails.precision
            ),
            denom: lpDetails.coinA.denom,
            symbol: lpDetails.coinA.symbol,
          },
          coinB: {
            amount: formatUTokenWithPrecision(
              tokenAmount.times(lpDetails.coinB.amountBPerShare) as U<
                Token<Big>
              >,
              lpDetails.precision
            ),
            denom: lpDetails.coinB.denom,
            symbol: lpDetails.coinB.symbol,
          },
        },
        value: tokenAmount
          .times(lpDetails.lpPricePerShare)
          .div(big(10).pow(lpDetails.precision)) as USD<Big>,
      }
    : {
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
        denom: "",
        amount: big(0) as U<Token<Big>>,
        symbol: undefined,
        logo: undefined,
        precision: undefined,
        value: big(0) as USD<Big>,
      };
};

export const totalValueTokenWithValue = (
  tokens: Record<string, TokenWithValue>,
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
