import { Flex, Text } from "@chakra-ui/react";

import { VerifyPublishCodeModal } from "lib/components/modal";
import { VerifyButton } from "lib/pages/code-details/components/verification-info/components/VerifyButton";

interface NotVerifiedDetailsProps {
  codeId: number;
  codeHash: string;
}
export const NotVerifiedDetails = ({
  codeId,
  codeHash,
}: NotVerifiedDetailsProps) => (
  <Flex gap={8} alignItems="center" justifyContent="space-between">
    <Text variant="body2" color="text.dark">
      This contract is an instance of code ID{" "}
      <Text color="secondary.main" display="inline-flex">
        {codeId}
      </Text>{" "}
      which has not been verified. If you are the owner of the code, you can
      <Flex display="inline-flex" px={1}>
        <VerifyPublishCodeModal
          codeId={codeId}
          codeHash={codeHash}
          triggerElement={
            <Text
              cursor="pointer"
              color="primary.main"
              transition="all 0.25s ease-in-out"
              _hover={{
                textDecoration: "underline",
                textDecorationColor: "primary.light",
              }}
            >
              verify it
            </Text>
          }
        />
      </Flex>
      to allow other users to view the GitHub repository and use the
      query/execute functions through the generated schema.
    </Text>
    <VerifyButton codeId={codeId} codeHash={codeHash} />
  </Flex>
);
