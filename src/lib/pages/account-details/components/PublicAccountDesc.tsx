import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const PublicAccountDesc = ({ description }: { description: string }) => (
  <Flex
    bg="gray.900"
    flex={1}
    maxW="100%"
    px={4}
    py={4}
    borderRadius="8px"
    direction="column"
  >
    <Flex alignItems="center" gap={1} minH="32px">
      <CustomIcon mb={2} ml={0} name="website" color="gray.600" />
      <Text variant="body2" color="text.dark" fontWeight={500}>
        Public Account Description
      </Text>
    </Flex>
    <Text mb={1} variant="body2" color="text.main">
      {description}
    </Text>
  </Flex>
);
