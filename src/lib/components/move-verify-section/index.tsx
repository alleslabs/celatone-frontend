import { Flex, Text } from "@chakra-ui/react";

import { useIsApiChain } from "lib/app-provider";
import { MoveVerifyStatus } from "lib/types";

import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { OutdatedDetails } from "./OutdatedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

interface MoveVerifySectionProps {
  status: MoveVerifyStatus;
}

const MoveVerifySectionBody = ({ status }: MoveVerifySectionProps) => {
  const isApiChain = useIsApiChain({
    shouldRedirect: false,
  });
  if (!isApiChain)
    return (
      <Text variant="body2" color="text.dark">
        Module verification is only available on official networks
      </Text>
    );

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
    direction={{ base: "column", md: "row" }}
    gap={2}
    justifyContent="space-between"
    w="full"
  >
    <MoveVerifySectionBody {...props} />
  </Flex>
);
