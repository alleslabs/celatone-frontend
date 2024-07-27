import { Button, Flex, Text } from "@chakra-ui/react";

import { CodeVerificationStatus } from "lib/components/modal/code-verification-status";

import { VerifyButton } from "./VerifyButton";

interface FailedDetailsProps {
  codeId: string;
  codeHash: string;
  submittedTime: string;
}

export const FailedDetails = ({
  codeId,
  codeHash,
  submittedTime,
}: FailedDetailsProps) => (
  <>
    <Text variant="body2" color="text.dark">
      Verification failed: Verification was submitted on {submittedTime} but an
      error occurred.
    </Text>
    <Flex gap={2}>
      <CodeVerificationStatus
        triggerElement={
          <Button variant="ghost-primary" size="sm">
            View Details
          </Button>
        }
      />
      <VerifyButton codeId={codeId} codeHash={codeHash} label="Reverify Code" />
    </Flex>
  </>
);
