import { InfoIcon } from "@chakra-ui/icons";
import { Flex, Heading, Image, Text, Tooltip } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { NAToken } from "lib/icon";
import type { TokenWithValue } from "lib/pages/account-details/type";
import type { Option } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface TotalCardProps {
  title: string;
  message: string;
  token: Option<TokenWithValue>;
}

export const TotalCard = ({ title, message, token }: TotalCardProps) => (
  <Flex direction="column" minW="233px" gap={1}>
    {!token ? (
      <Loading />
    ) : (
      <>
        <Flex alignItems="center" gap={1}>
          <Text variant="body2" fontWeight="500" textColor="text.dark">
            {title}
          </Text>
          <Tooltip
            hasArrow
            placement="top"
            label={message}
            bg="honeydew.darker"
          >
            <InfoIcon color="pebble.600" boxSize={3} cursor="pointer" />
          </Tooltip>
        </Flex>
        <Flex alignItems="center" gap={1}>
          <Heading variant="h6" as="h6">
            {formatUTokenWithPrecision(token.amount, token.precision || 0)}
          </Heading>
          <Text variant="body1" textColor="text.main">
            {getTokenLabel(token.denom)}
          </Text>
          <Image
            boxSize={6}
            src={token.logo}
            alt={getTokenLabel(token.denom)}
            fallback={<NAToken />}
            fallbackStrategy="onError"
          />
        </Flex>
        <Text variant="body2" textColor="text.dark">
          ({token.value ? formatPrice(token.value) : "-"})
        </Text>
      </>
    )}
  </Flex>
);
