import { Flex, Heading, Text } from "@chakra-ui/react";

interface CustomNetworkSubheaderProps {
  subtitle?: string;
  title: string;
}

export const CustomNetworkSubheader = ({
  subtitle,
  title,
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
