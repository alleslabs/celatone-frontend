import type Big from "big.js";
import type { Option, TokenWithValue, USD } from "lib/types";

import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { big } from "lib/types";
import { formatPrice, totalValueTokenWithValue } from "lib/utils";

interface MultiBondsRadioCardProps {
  value: string;
  tokens: Option<Record<string, TokenWithValue>>;
  isLoading: boolean;
}

const MultiBondsRadioCardBody = ({
  isLoading,
  tokens,
}: Omit<MultiBondsRadioCardProps, "value">) => {
  if (isLoading) return <Spinner alignSelf="center" mt={2} size="xl" />;
  if (!tokens)
    return (
      <Heading as="h6" variant="h6">
        N/A
      </Heading>
    );

  return (
    <Heading as="h6" variant="h6">
      {formatPrice(totalValueTokenWithValue(tokens, big(0) as USD<Big>))}
    </Heading>
  );
};

export const MultiBondsRadioCard = ({
  isLoading,
  tokens,
  value,
}: MultiBondsRadioCardProps) => (
  <Flex alignItems="flex-start" direction="column" gap={1} w="full">
    <Text fontWeight={600} textColor="gray.400" variant="body2">
      {value}
    </Text>
    <MultiBondsRadioCardBody isLoading={isLoading} tokens={tokens} />
  </Flex>
);
