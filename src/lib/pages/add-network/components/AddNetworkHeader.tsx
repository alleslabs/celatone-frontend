import { Alert, AlertDescription, Flex, Heading, Text } from "@chakra-ui/react";

interface AddNetworkHeaderProps {
  title: string;
}

export const AddNetworkHeader = ({ title }: AddNetworkHeaderProps) => (
  <>
    <Flex direction="column" gap={2} alignItems="center">
      <Heading as="h6" variant="h6" color="text.dark">
        Add Custom Minitia
      </Heading>
      <Heading as="h4" variant="h4">
        {title}
      </Heading>
    </Flex>
    <Alert my={4} p={3} variant="info">
      <AlertDescription>
        <Text color="text.dark" textAlign="center" lineHeight="normal">
          Please note that the custom Minitia you add on our website will only
          be stored locally on your device.
        </Text>
      </AlertDescription>
    </Alert>
  </>
);
