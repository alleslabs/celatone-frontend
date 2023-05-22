import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";

import { Tooltip } from "lib/components/Tooltip";
import { NAToken } from "lib/icon";
import type { Option, TokenWithValue } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface TotalCardProps {
  title: string;
  message: string;
  token: Option<TokenWithValue>;
  isLoading: boolean;
}

export const TotalCard = ({
  title,
  message,
  token,
  isLoading,
}: TotalCardProps) => (
  <Flex direction="column" minW="233px" gap={1}>
    {isLoading ? (
      <Spinner mt={2} alignSelf="center" size="xl" />
    ) : (
      <>
        <Flex alignItems="center" gap={1}>
          <Text variant="body2" fontWeight="500" textColor="text.dark">
            {title}
          </Text>
          <Tooltip label={message}>
            <InfoIcon color="gray.600" boxSize={3} cursor="pointer" />
          </Tooltip>
        </Flex>
        {!token ? (
          <Heading variant="h6" as="h6">
            N/A
          </Heading>
        ) : (
          <Flex alignItems="center" gap={1}>
            <Heading variant="h6" as="h6">
              {formatUTokenWithPrecision(token.amount, token.precision || 0)}
            </Heading>
            <Text variant="body1" textColor="text.main">
              {token.symbol ?? getTokenLabel(token.denom)}
            </Text>
            <Image
              boxSize={6}
              src={token.logo}
              alt={token.symbol ?? getTokenLabel(token.denom)}
              fallback={<NAToken />}
              fallbackStrategy="onError"
            />
          </Flex>
        )}
        <Text variant="body2" textColor="text.dark">
          ({token?.value ? formatPrice(token.value) : "-"})
        </Text>
      </>
    )}
  </Flex>
);
