import { Flex, Text } from "@chakra-ui/react";

interface ValidatorDescriptionProps {
  details: string;
}

export const ValidatorDescription = ({
  details,
}: ValidatorDescriptionProps) => (
  <Flex
    gap={2}
    p={4}
    w="100%"
    backgroundColor="gray.900"
    direction="column"
    rounded={8}
  >
    <Text as="h6" variant="body2" color="text.dark" fontWeight={500}>
      Validator Description
    </Text>
    {!details ? (
      <Text variant="body2" color="text.dark">
        No description provided
      </Text>
    ) : (
      <Text variant="body2" color="text.main">
        {details}
      </Text>
    )}
  </Flex>
);
