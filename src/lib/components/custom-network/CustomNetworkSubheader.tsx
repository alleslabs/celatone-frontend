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
    <Flex gap={1} direction="column">
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
