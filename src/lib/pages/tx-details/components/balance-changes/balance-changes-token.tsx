import type { BigSource } from "big.js";
import type { Coin, Token, U, USD } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";
import { useAssetInfos } from "lib/services/assetService";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";
import { isUndefined } from "lodash";

interface BalanceChangesTokenProps {
  coin: Coin;
}

export const BalanceChangesToken = ({ coin }: BalanceChangesTokenProps) => {
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);

  const tokenWithValue = formatUTokenWithPrecision(
    token.amount.abs() as U<Token<Big>>,
    token.precision ?? 0,
    false,
    undefined,
    true
  );

  const isPositiveAmount = token.amount.gte(0);
  const formattedAmount = `${isPositiveAmount ? "+" : "-"}${tokenWithValue}`;

  return (
    <Flex align="center" gap={1}>
      <TokenImageRender
        alt={getTokenLabel(token.denom, token.symbol)}
        boxSize={4}
        logo={token.logo}
      />
      <Text
        color={isPositiveAmount ? "success.main" : "error.main"}
        variant="body2"
      >
        {formattedAmount} {getTokenLabel(token.denom, token.symbol)}
      </Text>
      {!isUndefined(token.value) && (
        <Text color="text.dark" variant="body3">
          ({formatPrice(token.value.abs() as USD<BigSource>)})
        </Text>
      )}
    </Flex>
  );
};
