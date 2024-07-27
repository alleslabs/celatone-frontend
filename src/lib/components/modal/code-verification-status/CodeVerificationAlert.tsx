import { Alert, AlertDescription, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface CodeVerificationAlertProps {
  variant?: "accent" | "error";
}
export const CodeVerificationAlert = ({
  variant = "accent",
}: CodeVerificationAlertProps) => (
  <Alert p={2} variant={variant} gap={4}>
    <CustomIcon
      name="alert-triangle-solid"
      boxSize={4}
      color={`${variant}.main`}
    />
    <AlertDescription>
      <Text color={`${variant}.main`} style={{ fontWeight: 700 }}>
        Verification is in progress and may take hours depending on code
        complexity.
      </Text>
      <Text color={`${variant}.main`} variant="body3">
        You can close this page and view the verification process on code
        details page
      </Text>
    </AlertDescription>
  </Alert>
);
