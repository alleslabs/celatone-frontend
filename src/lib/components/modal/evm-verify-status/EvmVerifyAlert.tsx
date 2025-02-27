import { Alert, AlertDescription, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface EvmVerifyAlertProps {
  errorMsg: string;
}
export const EvmVerifyAlert = ({ errorMsg }: EvmVerifyAlertProps) => (
  <Alert p={2} variant="error" gap={{ base: 2, md: 4 }} alignItems="flex-start">
    <CustomIcon name="alert-triangle-solid" boxSize={4} color="error.main" />
    <AlertDescription>
      <Flex direction="column" gap={1}>
        <Text
          variant="body2"
          color="error.main"
          fontWeight={600}
          lineHeight="normal"
        >
          Verification failed
        </Text>
        <Text
          variant="body3"
          color="error.main"
          wordBreak="break-all"
          lineHeight="normal"
        >
          {errorMsg}
        </Text>
      </Flex>
    </AlertDescription>
  </Alert>
);
