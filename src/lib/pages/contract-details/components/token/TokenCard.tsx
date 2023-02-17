import { Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";

import { Copier } from "lib/components/Copier";
import type { BalanceWithAssetInfo, Token } from "lib/types";
import { assetValue, formatPrice, formatTokenWithPrecision } from "lib/utils";

interface TokenCardProps {
  userBalance: BalanceWithAssetInfo;
}

export const TokenCard = ({ userBalance }: TokenCardProps) => {
  const { symbol, price, amount, precision, id } = userBalance.balance;
  const tokenWithPrecision = formatTokenWithPrecision(
    amount as Token,
    precision
  );

  const tokenInfoText = useMemo(
    () =>
      price
        ? `1 ${symbol} = $${formatPrice(price)}
    Token ID: ${id}`
        : "No Price Data",
    [id, price, symbol]
  );

  return (
    <Tooltip
      hasArrow
      label={tokenInfoText}
      placement="top"
      bg="honeydew.darker"
      maxW="240px"
      whiteSpace="pre-line"
      textAlign="center"
    >
      <Flex
        gap={2}
        p={2}
        background="pebble.900"
        borderRadius="8px"
        alignItems="center"
        role="group"
      >
        <Image boxSize={8} src={userBalance.assetInfo?.logo} alt={symbol} />
        <Box>
          <Flex gap={1}>
            <Text fontWeight="700" variant="body2">
              {tokenWithPrecision}
            </Text>
            <Text variant="body2">{symbol}</Text>
            <Box
              _groupHover={{ display: "flex" }}
              display="none"
              alignItems="center"
            >
              <Copier value={id} copyLabel="Token ID Copied!" ml="1px" />
            </Box>
          </Flex>
          <Text variant="body3" color="text.dark">
            {price
              ? `$${formatPrice(
                  assetValue(tokenWithPrecision, price).toNumber()
                )}`
              : "-"}
          </Text>
        </Box>
      </Flex>
    </Tooltip>
  );
};
