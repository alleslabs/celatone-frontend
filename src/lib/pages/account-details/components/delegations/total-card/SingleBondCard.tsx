import { Flex, Heading, Image, Text } from "@chakra-ui/react";

import { NAToken } from "lib/icon";
import type { Option, TokenWithValue } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

import { TotalCardTop } from "./TotalCardTop";

interface SingleBondCardProps {
  title: string;
  message: string;
  token: Option<TokenWithValue>;
}

export const SingleBondCard = ({
  title,
  message,
  token,
}: SingleBondCardProps) => (
  <Flex direction="column" minW="233px" gap={1}>
    <TotalCardTop title={title} message={message} fontWeight={500} />
    {!token ? (
      <Heading variant="h6" as="h6">
        N/A
      </Heading>
    ) : (
      <Flex alignItems="center" gap={1}>
        <Heading variant="h6" as="h6">
          {formatUTokenWithPrecision(token.amount, token.precision ?? 0)}
        </Heading>
        <Text variant="body1" textColor="text.main">
          {getTokenLabel(token.denom, token.symbol)}
        </Text>
        <Image
          boxSize={6}
          src={token.logo}
          alt={getTokenLabel(token.denom, token.symbol)}
          fallback={<NAToken />}
        />
      </Flex>
    )}
    <Text variant="body2" textColor="text.dark">
      ({token?.value ? formatPrice(token.value) : "-"})
    </Text>
  </Flex>
);
