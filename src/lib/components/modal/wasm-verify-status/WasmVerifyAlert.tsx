import { Alert, AlertDescription, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { Nullable } from "lib/types";

interface WasmVerifyAlertProps {
  errorMsg: Nullable<string>;
}
export const WasmVerifyAlert = ({ errorMsg }: WasmVerifyAlertProps) => {
  const variant = errorMsg ? "error" : "accent";
  return (
    <Alert p={2} variant={variant} gap={4} mb={6}>
      <CustomIcon
        name="alert-triangle-solid"
        boxSize={4}
        color={`${variant}.main`}
      />
      <AlertDescription>
        <Flex direction="column" gap={1}>
          <Text
            variant="body2"
            color={`${variant}.main`}
            style={{ fontWeight: 500 }}
          >
            {errorMsg
              ? "Verification failed"
              : "Verification is in progress and may take hours depending on code complexity."}
          </Text>
          <Text
            variant="body3"
            color={`${variant}.main`}
            wordBreak="break-all"
            lineHeight={1.2}
          >
            {errorMsg ||
              "You can close this page and view the verification process on code details page"}
          </Text>
        </Flex>
      </AlertDescription>
    </Alert>
  );
};
