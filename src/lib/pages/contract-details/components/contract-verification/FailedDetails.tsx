import { Button, Flex, Text } from "@chakra-ui/react";

import { VerifyPublishCodeModal } from "lib/components/modal";
import { CodeVerificationStatus } from "lib/components/modal/code-verification-status";

interface FailedDetailsProps {
  codeId: string;
  codeHash: string;
  submittedTime: string;
}
export const FailedDetails = ({
  codeId,
  codeHash,
  submittedTime,
}: FailedDetailsProps) => {
  return (
    <Flex alignItems="center" gap={8} justifyContent="space-between" w="full">
      <Text variant="body2" color="text.dark">
        This contract is an instance of code ID{" "}
        <Text color="secondary.main" display="inline-flex" lineHeight={0}>
          {codeId}
        </Text>{" "}
        ,verification was submitted on {submittedTime} but an error occurred.
      </Text>
      <Flex>
        <CodeVerificationStatus
          triggerElement={
            <Button variant="ghost-primary" size="sm">
              View Details
            </Button>
          }
        />
        <VerifyPublishCodeModal
          codeId={codeId}
          codeHash={codeHash}
          triggerElement={
            <Button variant="ghost-primary" size="sm">
              Verify Code
            </Button>
          }
        />
      </Flex>
    </Flex>
  );
};
