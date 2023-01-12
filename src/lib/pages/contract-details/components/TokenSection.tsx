import { Flex, Text } from "@chakra-ui/react";

/**
 * @todos
 * - Make an interface for TokenSection and TokenCard
 * - Wireup with real data
 * - Token icon
 */
const TokenCard = () => {
  return (
    <Flex gap={1} p={2} background="gray.900" borderRadius="8px" flex={0.25}>
      <Text color="text.main">
        <span style={{ fontWeight: 700 }}>1.00</span> OSMO
      </Text>
    </Flex>
  );
};

export const TokenSection = () => {
  return (
    <Flex direction="column">
      <Text variant="body2" color="text.dark" mb={1} fontWeight={500}>
        Tokens
      </Text>
      <Flex gap={4}>
        <TokenCard />
        <TokenCard />
        <TokenCard />
        <TokenCard />
      </Flex>
    </Flex>
  );
};
