import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";

import type { BalanceWithAssetInfo, Token } from "lib/types";
import { assetValue, formatTokenWithPrecision } from "lib/utils";

interface TokenCardProps {
  userBalance: BalanceWithAssetInfo;
}

export const TokenCard = ({ userBalance }: TokenCardProps) => {
  const { symbol, price, amount, precision } = userBalance.balance;
  const tokenWithPrecision = formatTokenWithPrecision(
    amount as Token,
    precision
  );

  return (
    <Tooltip
      hasArrow
      label={price ? `1 ${symbol} = $${price}` : "No Price Data"}
      placement="top"
      bg="honeydew.darker"
      maxW="240px"
    >
      <Flex
        gap={2}
        p={2}
        background="pebble.900"
        borderRadius="8px"
        alignItems="center"
      >
        <Image boxSize={8} src={userBalance.assetInfo?.logo} alt={symbol} />
        <Box>
          <Flex gap={1}>
            <Text fontWeight="700" variant="body2">
              {tokenWithPrecision}
            </Text>
            <Text variant="body2">{symbol}</Text>
          </Flex>
          <Text variant="body3" color="text.dark">
            {price ? `$${assetValue(tokenWithPrecision, price)}` : "-"}
          </Text>
        </Box>
      </Flex>
    </Tooltip>
  );
};
