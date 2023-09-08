import { Flex, Text } from "@chakra-ui/react";

export const StateCard = () => {
  return (
    <Flex borderRadius={8} bgColor="gray.900" p={3}>
      <Flex w="15%">
        <Text variant="body2" color="text.main">
          lorem
        </Text>
      </Flex>
      <Flex w="85%">
        <Text variant="body2" color="text.dark">
          lorem
        </Text>
      </Flex>
    </Flex>
  );
};
