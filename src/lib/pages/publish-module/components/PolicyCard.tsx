import { Flex, Radio, Text, Heading, Spinner } from "@chakra-ui/react";

interface PolicyCardProps {
  value: string;
  description: string;
  // total: Option<Record<string, TokenWithValue>>;
  // defaultToken: TokenWithValue;
  hasCondition?: boolean;
  isLoading: boolean;
}

export const PolicyCard = ({
  value,
  description,
  isLoading,
  hasCondition = false,
}: PolicyCardProps) => {
  return (
    <Radio variant="card" value={value} overflowX="hidden">
      <Flex direction="column" gap={1} py={1}>
        {isLoading ? (
          <Spinner mt={2} alignSelf="center" size="xl" />
        ) : (
          <Flex flexDirection="column">
            <Heading
              variant="h6"
              as="h6"
              fontWeight={600}
              textTransform="capitalize"
            >
              {value}
            </Heading>
            <Text variant="body2" textColor="text.dark" mt={1}>
              {description}
              {hasCondition && (
                <Text ml={1} as="span" variant="body2" textColor="primary.main">
                  View conditions
                </Text>
              )}
            </Text>
          </Flex>
        )}
      </Flex>
    </Radio>
  );
};
