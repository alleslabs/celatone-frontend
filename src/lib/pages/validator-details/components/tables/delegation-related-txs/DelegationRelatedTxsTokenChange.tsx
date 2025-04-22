import type { BigSource } from "big.js";
import type Big from "big.js";
import type {
  AssetInfos,
  Coin,
  MovePoolInfos,
  Option,
  Token,
  U,
  USD,
} from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { TokenImageRender } from "lib/components/token";
import { getUndefinedTokenIcon } from "lib/pages/pools/utils";
import {
  coinToTokenWithValue,
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface DelegationRelatedTxsTokenChangeProps {
  assetInfos: Option<AssetInfos>;
  coin: Coin;
  movePoolInfos: Option<MovePoolInfos>;
  txHash: string;
}

export const DelegationRelatedTxsTokenChange = ({
  assetInfos,
  coin,
  movePoolInfos,
  txHash,
}: DelegationRelatedTxsTokenChangeProps) => {
  const token = coinToTokenWithValue(
    coin.denom,
    coin.amount,
    assetInfos,
    movePoolInfos
  );
  const isPositiveAmount = token.amount.gte(0);
  const formattedAmount = `${isPositiveAmount ? "+" : "-"}${formatUTokenWithPrecision(token.amount.abs() as U<Token<Big>>, token.precision ?? 0, false, 2)}`;

  return (
    <Flex
      key={`${txHash}-${token.denom}`}
      alignItems="center"
      gap={2}
      justifyContent={{ base: "start", md: "end" }}
      w="100%"
    >
      <Box textAlign={{ base: "left", md: "right" }}>
        <Flex alignItems="center" gap={1}>
          <Text
            color={isPositiveAmount ? "success.main" : "error.main"}
            fontWeight={700}
          >
            {formattedAmount}
          </Text>
          <Text>{getTokenLabel(token.denom, token.symbol)}</Text>
          <TokenImageRender
            boxSize={4}
            display={{ base: "block", md: "none" }}
            logo={token.logo ?? getUndefinedTokenIcon(token.denom)}
          />
        </Flex>
        <Text color="text.dark" variant="body3">
          {token.value
            ? `(${formatPrice(token.value.abs() as USD<BigSource>)})`
            : "-"}
        </Text>
      </Box>
      <TokenImageRender
        boxSize={6}
        display={{ base: "none", md: "block" }}
        logo={token.logo ?? getUndefinedTokenIcon(token.denom)}
      />
    </Flex>
  );
};
