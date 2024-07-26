import { Alert, AlertDescription, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const CodeVerificationAlert = () => (
  <Alert p={2} variant="accent" gap={4}>
    <CustomIcon name="alert-triangle-solid" boxSize={4} color="accent.main" />
    <AlertDescription>
      <Text color="accent.main" style={{ fontWeight: 700 }}>
        Verification is in progress and may take hours depending on code
        complexity.
      </Text>
      <Text color="accent.main" variant="body3">
        You can close this page and view the verification process on code
        details page
      </Text>
    </AlertDescription>
  </Alert>
);
