import type { FlexProps } from "@chakra-ui/react";
import { Badge, Flex, Text } from "@chakra-ui/react";
import { isUndefined } from "lodash";

import { Copier } from "../copy";
import { Tooltip } from "../Tooltip";
import type { TokenWithValue } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
  isSupportedToken,
} from "lib/utils";

import { TokenImageRender } from "./TokenImageRender";

interface TokenCardProps extends FlexProps {
  amptrackSection?: string;
  token: TokenWithValue;
}

export const TokenCard = ({
  amptrackSection,
  token,
  ...cardProps
}: TokenCardProps) => (
  <Tooltip label={`Token ID: ${token.denom}`} textAlign="center">
    <Flex
      className="copier-wrapper"
      gap={2}
      minH="101px"
      p={3}
      background="gray.900"
      borderRadius="8px"
      direction="column"
      {...cardProps}
    >
      <Flex alignItems="center" gap={1}>
        <TokenImageRender
          alt={getTokenLabel(token.denom, token.symbol)}
          boxSize={6}
          logo={token.logo}
        />
        <Text className="ellipsis" maxW="91" variant="body2" fontWeight="bold">
          {token.symbol}
        </Text>
        <Badge ml={2} variant="gray">
          {!isUndefined(token.price) ? formatPrice(token.price) : "N/A"}
        </Badge>
        <Copier
          display={{ base: "flex", md: "none" }}
          ml={1}
          type={
            isSupportedToken(token) ? "supported_asset" : "unsupported_asset"
          }
          value={token.denom}
          amptrackSection={amptrackSection}
          copyLabel="Token ID Copied!"
        />
      </Flex>
      <Flex
        pt={2}
        borderTop="1px solid"
        borderTopColor="gray.700"
        direction="column"
      >
        <Text variant="body2" fontWeight={700}>
          {formatUTokenWithPrecision(token.amount, token.precision ?? 0, false)}
        </Text>
        <Text variant="body3" color="text.dark">
          {!isUndefined(token.value) ? `(${formatPrice(token.value)})` : "N/A"}
        </Text>
      </Flex>
    </Flex>
  </Tooltip>
);
