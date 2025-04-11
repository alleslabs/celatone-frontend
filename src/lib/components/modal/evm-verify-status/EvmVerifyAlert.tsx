import { Alert, AlertDescription, Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

interface EvmVerifyAlertProps {
  errorMsg: string;
}
export const EvmVerifyAlert = ({ errorMsg }: EvmVerifyAlertProps) => (
  <Alert alignItems="flex-start" gap={{ base: 2, md: 4 }} p={2} variant="error">
    <CustomIcon boxSize={4} color="error.main" name="alert-triangle-solid" />
    <AlertDescription>
      <Flex direction="column" gap={1}>
        <Text
          color="error.main"
          fontWeight={600}
          lineHeight="normal"
          variant="body2"
        >
          Verification failed
        </Text>
        <Text
          color="error.main"
          lineHeight="normal"
          variant="body3"
          wordBreak="break-all"
        >
          {errorMsg}
        </Text>
      </Flex>
    </AlertDescription>
  </Alert>
);
