import { Flex, Heading, Text } from "@chakra-ui/react";

interface AddNetworkSubheaderProps {
  title: string;
  subtitle?: string;
}

export const AddNetworkSubheader = ({
  title,
  subtitle,
}: AddNetworkSubheaderProps) => {
  return (
    <Flex direction="column" gap={1}>
      <Heading as="h6" variant="h6">
        {title}
      </Heading>
      {subtitle && (
        <Text variant="body2" color="text.disabled">
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};
