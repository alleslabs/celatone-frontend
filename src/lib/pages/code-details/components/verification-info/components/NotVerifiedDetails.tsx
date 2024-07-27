import { Flex, Text } from "@chakra-ui/react";

import { VerifyPublishCodeModal } from "lib/components/modal";

import { VerifyButton } from "./VerifyButton";

interface NotVerifiedDetailsProps {
  codeId: string;
  codeHash: string;
}

export const NotVerifiedDetails = ({
  codeId,
  codeHash,
}: NotVerifiedDetailsProps) => (
  <>
    <Text variant="body2" color="text.dark">
      This code has not been verified. If you are the owner of the code, you can
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
    <VerifyButton codeId={codeId} codeHash={codeHash} label="Verify Code" />
  </>
);
