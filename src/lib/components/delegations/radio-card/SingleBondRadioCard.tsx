import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";

import type { Option, TokenWithValue } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface SingleBondRadioCardProps {
  isLoading: boolean;
  token: Option<TokenWithValue>;
  value: string;
}

const SingleBondRadioCardBody = ({
  isLoading,
  token,
}: Omit<SingleBondRadioCardProps, "value">) => {
  if (isLoading) return <Spinner alignSelf="center" mt={2} size="xl" />;
  if (!token)
    return (
      <Heading as="h6" variant="h6">
        N/A
      </Heading>
    );

  return (
    <Flex alignItems="end" gap={1}>
      <Heading as="h6" variant={{ base: "h7", md: "h6" }}>
        {formatUTokenWithPrecision(token.amount, token.precision ?? 0)}
      </Heading>
      <Text variant="body2" textColor="text.main">
        {getTokenLabel(token.denom, token.symbol)}
      </Text>
    </Flex>
  );
};

export const SingleBondRadioCard = ({
  isLoading,
  token,
  value,
}: SingleBondRadioCardProps) => (
  <Flex
    alignItems={{ base: "flex-start", md: "center" }}
    gap={{ base: 1, md: 2 }}
    w="full"
    direction={{ base: "column", md: "row" }}
    justifyContent="space-between"
  >
    <Flex alignItems="flex-start" gap={1} direction="column">
      <Text variant="body2" fontWeight={500} textColor="gray.400">
        {value}
      </Text>
      <SingleBondRadioCardBody isLoading={isLoading} token={token} />
    </Flex>
    <Text variant="body2" textColor="text.dark">
      ({token?.value ? formatPrice(token.value) : "-"})
    </Text>
  </Flex>
);
