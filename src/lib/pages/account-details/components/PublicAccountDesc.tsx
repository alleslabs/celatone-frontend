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
      <CustomIcon color="gray.600" mb={2} ml={0} name="website" />
      <Text color="text.dark" fontWeight={500} variant="body2">
        Public account description
      </Text>
    </Flex>
    <Text color="text.main" mb={1} variant="body2">
      {description}
    </Text>
  </Flex>
);
