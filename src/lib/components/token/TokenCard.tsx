import type { FlexProps } from "@chakra-ui/react";
import type { TokenWithValue } from "lib/types";

import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
  isSupportedToken,
} from "lib/utils";
import { isUndefined } from "lodash";

import { Copier } from "../copy";
import { Tooltip } from "../Tooltip";
import { TokenImageRender } from "./TokenImageRender";

interface TokenCardProps extends FlexProps {
  amptrackSection?: string;
  token: TokenWithValue;
}

export const TokenCard = ({
  amptrackSection,
  token,
  ...cardProps
}: TokenCardProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });

  return (
    <Tooltip
      disableClickCapture
      label={`Token ID: ${token.denom}`}
      textAlign="center"
    >
      <Flex
        className="copier-wrapper"
        background="gray.900"
        borderRadius="8px"
        direction="column"
        gap={2}
        minH="101px"
        p={3}
        w="100%"
        {...cardProps}
      >
        <Flex alignItems="center" gap={1}>
          <TokenImageRender
            alt={getTokenLabel(token.denom, token.symbol)}
            boxSize={6}
            logo={token.logo}
          />
          <Text className="ellipsis" fontWeight="bold" variant="body2">
            {token.symbol}
          </Text>
          <Badge ml={1} variant="gray">
            {!isUndefined(token.price) ? formatPrice(token.price) : "N/A"}
          </Badge>
          <Box w={4}>
            <Copier
              amptrackSection={amptrackSection}
              copyLabel="Token ID copied!"
              display={{ base: "flex", md: "none" }}
              ml={1}
              type={
                isSupportedToken(token)
                  ? "supported_asset"
                  : "unsupported_asset"
              }
              value={token.denom}
            />
          </Box>
        </Flex>
        <Flex
          borderTopColor="gray.700"
          borderTopWidth="1px"
          direction="column"
          pt={2}
        >
          <Text fontWeight={700} variant="body2">
            {formatUTokenWithPrecision({
              amount: token.amount,
              isEvm: evm.enabled,
              isSuffix: false,
              precision: token.precision ?? 0,
            })}
          </Text>
          <Text color="text.dark" variant="body3">
            {!isUndefined(token.value)
              ? `(${formatPrice(token.value)})`
              : "N/A"}
          </Text>
        </Flex>
      </Flex>
    </Tooltip>
  );
};
