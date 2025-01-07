import { Flex } from "@chakra-ui/react";

import { MoveVerifyStatus } from "lib/types";

import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { OutdatedDetails } from "./OutdatedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

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
    alignItems={{ base: "start", md: "center" }}
    gap={2}
    w="full"
    direction={{ base: "column", md: "row" }}
    justifyContent="space-between"
  >
    <MoveVerifySectionBody {...props} />
  </Flex>
);
