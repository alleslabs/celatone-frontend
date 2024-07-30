import { Button, Flex, Text } from "@chakra-ui/react";

import { VerifyPublishCodeModal } from "lib/components/modal";
import {
  VerificationBadge,
  VerificationStatus,
} from "lib/components/VerificationBadge";

interface IndirectlyVerifiedDetailsProps {
  codeId: string;
  codeHash: string;
}
export const IndirectlyVerifiedDetails = ({
  codeId,
  codeHash,
}: IndirectlyVerifiedDetailsProps) => {
  return (
    <Flex alignItems="center" gap={8} justifyContent="space-between" w="full">
      <Text variant="body2" color="text.dark">
        This contract is an instance of code ID{" "}
        <Flex display="inline-flex" alignItems="center">
          <Text color="secondary.main" display="inline-flex" lineHeight={0}>
            {codeId}
          </Text>{" "}
          <VerificationBadge
            status={VerificationStatus.INDIRECTLY_VERIFIED}
            type="code"
          />
        </Flex>
        which has the same code hash with other verified codes. If you are the
        code owner, you can verify this code to specify the GitHub repository
      </Text>
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
  );
};
