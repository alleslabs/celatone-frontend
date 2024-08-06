import { Alert, AlertDescription, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { Nullable } from "lib/types";

interface WasmVerifyAlertProps {
  errorMsg: Nullable<string>;
}
export const WasmVerifyAlert = ({ errorMsg }: WasmVerifyAlertProps) => {
  const variant = errorMsg ? "error" : "accent";
  const icon = errorMsg ? "alert-triangle-solid" : "info-circle-solid";
  return (
    <Alert
      p={2}
      variant={variant}
      gap={{ base: 2, md: 4 }}
      mb={{ base: 4, md: 6 }}
      alignItems="flex-start"
    >
      <CustomIcon name={icon} boxSize={4} color={`${variant}.main`} />
      <AlertDescription>
        <Flex direction="column" gap={1}>
          <Text
            variant="body2"
            color={`${variant}.main`}
            fontWeight={600}
            lineHeight="normal"
          >
            {errorMsg
              ? "Verification failed"
              : "Verification is in progress and may take hours depending on code complexity."}
          </Text>
          <Text
            variant="body3"
            color={`${variant}.main`}
            wordBreak={errorMsg ? "break-all" : "break-word"}
            lineHeight="normal"
          >
            {errorMsg ||
              "You can close this page and view the verification process on code details page"}
          </Text>
        </Flex>
      </AlertDescription>
    </Alert>
  );
};
