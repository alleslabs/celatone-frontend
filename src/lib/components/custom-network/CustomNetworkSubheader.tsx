import { Flex, Heading, Text } from "@chakra-ui/react";

interface CustomNetworkSubheaderProps {
  title: string;
  subtitle?: string;
}

export const CustomNetworkSubheader = ({
  title,
  subtitle,
}: CustomNetworkSubheaderProps) => {
  return (
    <Flex direction="column" gap={1}>
      <Heading as="h6" variant="h6">
        {title}
      </Heading>
      {subtitle && (
        <Text color="text.disabled" variant="body2">
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};
