import { Flex, Text } from "@chakra-ui/react";

interface ValidatorDescriptionProps {
  details: string;
}

export const ValidatorDescription = ({
  details,
}: ValidatorDescriptionProps) => (
  <Flex
    backgroundColor="gray.900"
    direction="column"
    gap={2}
    p={4}
    rounded={8}
    w="100%"
  >
    <Text variant="body2" fontWeight={500} as="h6" color="text.dark">
      Validator description
    </Text>
    {!details ? (
      <Text color="text.dark" variant="body2">
        No description provided
      </Text>
    ) : (
      <Text color="text.main" variant="body2">
        {details}
      </Text>
    )}
  </Flex>
);
