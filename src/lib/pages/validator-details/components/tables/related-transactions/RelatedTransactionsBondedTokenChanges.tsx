import { Box, Flex, Text } from "@chakra-ui/react";
import type { BigSource } from "big.js";
import type Big from "big.js";

import { TokenImageRender } from "lib/components/token";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import type { AssetInfos, Coin, Option, Token, U, USD } from "lib/types";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface RelatedTransactionsBondedTokenChangesProps {
  txHash: string;
  coin: Coin;
  assetInfos: Option<AssetInfos>;
}

export const RelatedTransactionsBondedTokenChanges = ({
  txHash,
  coin,
  assetInfos,
}: RelatedTransactionsBondedTokenChangesProps) => {
  const token = coinToTokenWithValue(coin.denom, coin.amount, assetInfos);
  const isPositiveAmount = token.amount.gte(0);
  const formattedAmount = `${isPositiveAmount ? "+" : "-"}${formatUTokenWithPrecision(token.amount.abs() as U<Token<Big>>, token.precision ?? 0, false, 2)}`;

  return (
    <Flex
      gap={2}
      key={`${txHash}-${coin.denom}`}
      w="100%"
      justifyContent={{ base: "start", md: "end" }}
      alignItems="center"
    >
      <Box textAlign={{ base: "left", md: "right" }}>
        <Flex alignItems="center" gap={1}>
          <Text
            fontWeight={700}
            color={isPositiveAmount ? "success.main" : "error.main"}
          >
            {formattedAmount}
          </Text>
          <Text>{getTokenLabel(token.denom, token.symbol)}</Text>
          <TokenImageRender
            display={{ base: "block", md: "none" }}
            boxSize={4}
            logo={token.logo ?? getUndefinedTokenIcon(token.denom)}
          />
        </Flex>
        <Text variant="body3" color="text.dark">
          {token.value
            ? `(${formatPrice(token.value.abs() as USD<BigSource>)})`
            : "-"}
        </Text>
      </Box>
      <TokenImageRender
        display={{ base: "none", md: "block" }}
        boxSize={6}
        logo={token.logo ?? getUndefinedTokenIcon(token.denom)}
      />
    </Flex>
  );
};
