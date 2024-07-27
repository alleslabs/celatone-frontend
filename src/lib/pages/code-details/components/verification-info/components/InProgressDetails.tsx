import { Button, Text } from "@chakra-ui/react";

import { CodeVerificationStatus } from "lib/components/modal/code-verification-status";

export const InProgressDetails = () => (
  <>
    <Text variant="body2" color="text.dark">
      Code verification is in progress and may take several hours depending on
      code complexity.
    </Text>
    <CodeVerificationStatus
      triggerElement={
        <Button variant="ghost-primary" size="sm">
          View Verification Details
        </Button>
      }
    />
  </>
);
