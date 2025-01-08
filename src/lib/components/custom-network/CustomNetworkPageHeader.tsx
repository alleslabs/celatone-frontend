import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";

interface CustomNetworkPageHeaderProps {
  hasAlert?: boolean;
  subtitle?: string;
  title: string;
}

export const CustomNetworkPageHeader = ({
  hasAlert = true,
  subtitle = "Add Custom Minitia",
  title,
}: CustomNetworkPageHeaderProps) => (
  <>
    <Flex alignItems="center" gap={2} direction="column">
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
          <Text lineHeight="normal" textAlign="center" color="text.dark">
            Please note that the custom Minitia you add on our website will only
            be stored locally on your device.
          </Text>
        </AlertDescription>
      </Alert>
    )}
  </>
);
