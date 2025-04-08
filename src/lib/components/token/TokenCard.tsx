import type { FlexProps } from "@chakra-ui/react";
import type { TokenWithValue } from "lib/types";

import { Badge, Flex, Text } from "@chakra-ui/react";
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
  token: TokenWithValue;
  amptrackSection?: string;
}

export const TokenCard = ({
  token,
  amptrackSection,
  ...cardProps
}: TokenCardProps) => (
  <Tooltip label={`Token ID: ${token.denom}`} textAlign="center">
    <Flex
      className="copier-wrapper"
      background="gray.900"
      borderRadius="8px"
      direction="column"
      gap={2}
      minH="101px"
      p={3}
      {...cardProps}
    >
      <Flex alignItems="center" gap={1}>
        <TokenImageRender
          alt={getTokenLabel(token.denom, token.symbol)}
          boxSize={6}
          logo={token.logo}
        />
        <Text className="ellipsis" fontWeight="bold" maxW="91" variant="body2">
          {token.symbol}
        </Text>
        <Badge ml={2} variant="gray">
          {!isUndefined(token.price) ? formatPrice(token.price) : "N/A"}
        </Badge>
        <Copier
          amptrackSection={amptrackSection}
          copyLabel="Token ID copied!"
          display={{ base: "flex", md: "none" }}
          ml={1}
          type={
            isSupportedToken(token) ? "supported_asset" : "unsupported_asset"
          }
          value={token.denom}
        />
      </Flex>
      <Flex
        borderTop="1px solid"
        borderTopColor="gray.700"
        direction="column"
        pt={2}
      >
        <Text fontWeight={700} variant="body2">
          {formatUTokenWithPrecision(token.amount, token.precision ?? 0, false)}
        </Text>
        <Text color="text.dark" variant="body3">
          {!isUndefined(token.value) ? `(${formatPrice(token.value)})` : "N/A"}
        </Text>
      </Flex>
    </Flex>
  </Tooltip>
);
