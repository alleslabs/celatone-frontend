import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const PublicAccountDesc = ({ description }: { description: string }) => (
  <Flex
    direction="column"
    bg="gray.900"
    maxW="100%"
    borderRadius="8px"
    py={4}
    px={4}
    flex={1}
  >
    <Flex alignItems="center" gap={1} minH="32px">
      <CustomIcon name="website" ml={0} mb={2} color="gray.600" />
      <Text variant="body2" fontWeight={500} color="text.dark">
        Public account description
      </Text>
    </Flex>
    <Text variant="body2" color="text.main" mb={1}>
      {description}
    </Text>
  </Flex>
);
