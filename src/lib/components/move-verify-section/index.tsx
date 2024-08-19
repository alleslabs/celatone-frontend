import { Flex } from "@chakra-ui/react";

import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { OutdatedDetails } from "./OutdatedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

export enum MoveVerifyStatus {
  Verified = "VERIFIED",
  NotVerified = "NOT_VERIFIED",
  Outdated = "OUTDATED",
}

interface MoveVerifySectionProps {
  status: MoveVerifyStatus;
}

const MoveVerifySectionBody = ({ status }: MoveVerifySectionProps) => {
  if (status === MoveVerifyStatus.Verified) {
    return <VerifiedDetails />;
  }
  if (status === MoveVerifyStatus.NotVerified) {
    return <NotVerifiedDetails />;
  }
  if (status === MoveVerifyStatus.Outdated) {
    return <OutdatedDetails />;
  }
  return null;
};

export const MoveVerifySection = (props: MoveVerifySectionProps) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    alignItems={{ base: "start", md: "center" }}
    justifyContent="space-between"
    w="full"
    gap={2}
  >
    <MoveVerifySectionBody {...props} />
  </Flex>
);
