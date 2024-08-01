import { Button, Flex, Text } from "@chakra-ui/react";

import { CodeVerificationStatus } from "lib/components/modal/code-verification-status";
import { VerificationBadge } from "lib/components/VerificationBadge";
import { VerificationStatus } from "lib/services/types";

interface VerifiedDetailsProps {
  codeId: number;
}
export const VerifiedDetails = ({ codeId }: VerifiedDetailsProps) => (
  <Flex alignItems="center" gap={8} justifyContent="space-between" w="full">
    <Text variant="body2" color="text.dark">
      This contract is an instance of code ID{" "}
      <Flex display="inline-flex" align="center">
        <Text color="secondary.main" display="inline-flex" lineHeight={0}>
          {codeId}
        </Text>{" "}
        <VerificationBadge status={VerificationStatus.VERIFIED} type="code" />
      </Flex>
      which has been verified.
    </Text>
    <CodeVerificationStatus
      triggerElement={
        <Button variant="ghost-primary" size="sm">
          View Details
        </Button>
      }
    />
  </Flex>
);
