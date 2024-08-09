import { Flex } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import type { MoveVerifyTaskStatus } from "lib/services/types";

interface MyModuleVerificationDetailsInfoProps {
  chainId: string;
  status: MoveVerifyTaskStatus;
}

export const MyModuleVerificationDetailsInfo = ({
  chainId,
  status,
}: MyModuleVerificationDetailsInfoProps) => {
  return (
    <Flex>
      <LabelText label="Network">{chainId}</LabelText>
      <LabelText label="Status">{status.toString()}</LabelText>
    </Flex>
  );
};
