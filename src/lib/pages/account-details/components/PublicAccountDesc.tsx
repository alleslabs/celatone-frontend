import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const PublicAccountDesc = ({ description }: { description: string }) => (
  <Flex
    bg="gray.900"
    borderRadius="8px"
    direction="column"
    flex={1}
    maxW="100%"
    px={4}
    py={4}
  >
    <Flex alignItems="center" gap={1} minH="32px">
      <CustomIcon name="website" ml={0} mb={2} color="gray.600" />
      <Text variant="body2" fontWeight={500} color="text.dark">
        Public account description
      </Text>
    </Flex>
    <Text color="text.main" mb={1} variant="body2">
      {description}
    </Text>
  </Flex>
);
