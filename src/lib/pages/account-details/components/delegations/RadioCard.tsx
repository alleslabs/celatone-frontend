import { Flex, Radio, Text, Heading, Spinner } from "@chakra-ui/react";

import type { TokenWithValue } from "lib/pages/account-details/type";
import type { Option } from "lib/types";
import {
  formatPrice,
  formatUTokenWithPrecision,
  getTokenLabel,
} from "lib/utils";

interface RadioCardProps {
  value: string;
  total: Option<Record<string, TokenWithValue>>;
  defaultToken: TokenWithValue;
  isLoading: boolean;
}

export const RadioCard = ({
  value,
  total,
  defaultToken,
  isLoading,
}: RadioCardProps) => {
  const token = total?.[defaultToken.denom] ?? defaultToken;
  return (
    <Radio variant="card" value={value} overflowX="hidden">
      <Flex alignItems="center" gap={2} justifyContent="space-between">
        <Flex direction="column" gap={1}>
          <Text variant="body2" textColor="pebble.400" fontWeight="500">
            {value}
          </Text>
          {isLoading ? (
            <Spinner mt={2} alignSelf="center" size="md" speed="0.65s" />
          ) : (
            <Flex alignItems="end" gap={1}>
              <Heading variant="h6" as="h6">
                {formatUTokenWithPrecision(token.amount, token.precision || 0)}
              </Heading>
              <Text variant="body2" textColor="text.main">
                {getTokenLabel(token.denom)}
              </Text>
            </Flex>
          )}
        </Flex>
        <Text variant="body2" textColor="text.dark">
          ({token.value ? formatPrice(token.value) : "-"})
        </Text>
      </Flex>
    </Radio>
  );
};
