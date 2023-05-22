import type { FlexProps } from "@chakra-ui/react";
import { Badge, Flex, Image, Text } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import type { BalanceWithAssetInfo, Token, U, USD } from "lib/types";
import {
  calAssetValueWithPrecision,
  formatPrice,
  formatUTokenWithPrecision,
} from "lib/utils";

import { Copier } from "./copy";
import { Tooltip } from "./Tooltip";

interface TokenCardProps extends FlexProps {
  userBalance: BalanceWithAssetInfo;
  amptrackSection?: string;
}

export const TokenCard = ({
  userBalance,
  amptrackSection,
  ...cardProps
}: TokenCardProps) => {
  const { symbol, price, amount, precision, id } = userBalance.balance;

  return (
    <Tooltip
      label={`Token ID: ${id}`}
      maxW="240px"
      whiteSpace="pre-line"
      textAlign="center"
    >
      <Flex
        className="copier-wrapper"
        direction="column"
        minH="101px"
        gap={2}
        p={3}
        background="gray.900"
        borderRadius="8px"
        {...cardProps}
      >
        <Flex
          gap={1}
          alignItems="center"
          borderBottom="1px solid"
          borderBottomColor="gray.700"
          pb={2}
        >
          <Image
            boxSize={6}
            src={userBalance.assetInfo?.logo}
            alt={symbol}
            fallback={<NAToken />}
            fallbackStrategy="onError"
          />
          <Text
            variant="body2"
            className="ellipsis"
            maxW="91"
            fontWeight="bold"
          >
            {symbol}
          </Text>
          <Badge variant="gray" ml="6px">
            {price ? formatPrice(price as USD<number>) : "N/A"}
          </Badge>
          <Copier
            type={price ? "supported_asset" : "unsupported_asset"}
            value={id}
            copyLabel="Token ID Copied!"
            display="none"
            ml="1px"
            amptrackSection={amptrackSection}
          />
        </Flex>

        <Flex direction="column">
          <Text fontWeight="700" variant="body2">
            {formatUTokenWithPrecision(amount as U<Token>, precision, false)}
          </Text>
          <Text variant="body3" color="text.dark">
            {price
              ? `(${formatPrice(
                  calAssetValueWithPrecision(userBalance.balance)
                )})`
              : "N/A"}
          </Text>
        </Flex>
      </Flex>
    </Tooltip>
  );
};
