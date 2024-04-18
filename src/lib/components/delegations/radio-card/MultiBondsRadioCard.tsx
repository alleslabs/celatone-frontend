import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import type Big from "big.js";

import { big } from "lib/types";
import type { Option, TokenWithValue, USD } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

interface MultiBondsRadioCardProps {
  value: string;
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
}

const MultiBondsRadioCardBody = ({
  tokens,
  isLoading,
}: Omit<MultiBondsRadioCardProps, "value">) => {
  if (isLoading) return <Spinner mt={2} alignSelf="center" size="xl" />;
  if (!tokens)
    return (
      <Heading variant="h6" as="h6">
        N/A
      </Heading>
    );

  return (
    <Heading variant="h6" as="h6">
      {formatPrice(totalValueTokenWithValue(tokens, big(0) as USD<Big>))}
    </Heading>
  );
};

export const MultiBondsRadioCard = ({
  value,
  tokens,
  isLoading,
}: MultiBondsRadioCardProps) => (
  <Flex direction="column" gap={1}>
    <Text variant="body2" textColor="gray.400" fontWeight={600}>
      {value}
    </Text>
    <MultiBondsRadioCardBody tokens={tokens} isLoading={isLoading} />
  </Flex>
);
