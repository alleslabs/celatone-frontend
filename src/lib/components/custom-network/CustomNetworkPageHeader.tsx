import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";

interface CustomNetworkPageHeaderProps {
  title: string;
  subtitle?: string;
  hasAlert?: boolean;
}

export const CustomNetworkPageHeader = ({
  title,
  subtitle = "Add Custom Rollup",
  hasAlert = true,
}: CustomNetworkPageHeaderProps) => (
  <>
    <Flex direction="column" gap={2} alignItems="center">
      <Heading as="h6" variant="h6" color="text.dark">
        {subtitle}
      </Heading>
      <Heading as="h4" variant="h4">
        {title}
      </Heading>
    </Flex>
    {hasAlert && (
      <Alert my={4} p={3} variant="info">
        <AlertDescription>
          <Text color="text.dark" textAlign="center" lineHeight="normal">
            Please note that the custom Rollup you add on our website will only
            be stored locally on your device.
          </Text>
        </AlertDescription>
      </Alert>
    )}
  </>
);
