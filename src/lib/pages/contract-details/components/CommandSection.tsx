import { Flex, Text } from "@chakra-ui/react";

export const CommandSection = () => {
  /**
   * @todos
   * - Make an interface
   * - Wireup with real query/execute commands data
   */
  return (
    <Flex gap={6}>
      <Flex
        direction="column"
        bg="gray.900"
        p={4}
        borderRadius="8px"
        flex={0.5}
      >
        <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
          Query Shortcuts
        </Text>
        {/* Query Contract Commands */}
      </Flex>
      <Flex
        direction="column"
        bg="gray.900"
        p={4}
        borderRadius="8px"
        flex={0.5}
      >
        <Text color="text.dark" variant="body2" fontWeight={500} mb={2}>
          Execute Shortcuts
        </Text>
        {/* Execute Contract Commands */}
      </Flex>
    </Flex>
  );
};
