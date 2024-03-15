import { Flex, Text } from "@chakra-ui/react";

interface ValidatorDescriptionProps {
  details: string;
}

export const ValidatorDescription = ({
  details,
}: ValidatorDescriptionProps) => (
  <Flex
    direction="column"
    gap={2}
    backgroundColor="gray.900"
    p={{ base: 4, md: 6 }}
    rounded={8}
    w="100%"
  >
    <Text variant="body2" fontWeight={500} as="h6" color="text.dark">
      Validator Description
    </Text>
    <Text variant="body2" color="text.main">
      {details}
    </Text>
  </Flex>
);
