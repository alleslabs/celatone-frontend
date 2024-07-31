import { Text } from "@chakra-ui/react";

import { VerifyButton } from "./VerifyButton";

interface IndirectlyVerifiedDetailsProps {
  codeId: number;
  codeHash: string;
}

export const IndirectlyVerifiedDetails = ({
  codeId,
  codeHash,
}: IndirectlyVerifiedDetailsProps) => (
  <>
    <Text variant="body2" color="text.dark">
      This code has the same code hash as the following verified stored codes:
      [Code Hash] and more. <br /> If you are the code owner, you can verify
      this code to specify the GitHub repository.
    </Text>
    <VerifyButton codeId={codeId} codeHash={codeHash} label="Verify Code" />
  </>
);
