import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";

interface CustomNetworkPageHeaderProps {
  title: string;
  subtitle?: string;
  hasAlert?: boolean;
}

export const CustomNetworkPageHeader = ({
  hasAlert = true,
  subtitle = "Add custom rollup",
  title,
}: CustomNetworkPageHeaderProps) => (
  <>
    <Flex alignItems="center" direction="column" gap={2}>
      <Heading as="h6" color="text.dark" variant="h6">
        {subtitle}
      </Heading>
      <Heading as="h4" variant="h4">
        {title}
      </Heading>
    </Flex>
    {hasAlert && (
      <Alert my={4} p={3} variant="info">
        <AlertDescription>
          <Text color="text.dark" lineHeight="normal" textAlign="center">
            Please note that the custom rollup you add on our website will only
            be stored locally on your device.
          </Text>
        </AlertDescription>
      </Alert>
    )}
  </>
);
