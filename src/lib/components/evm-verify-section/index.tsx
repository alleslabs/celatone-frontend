import { Flex } from "@chakra-ui/react";

import type { HexAddr20, Option } from "lib/types";

import { NotVerifiedDetails } from "./NotVerifiedDetails";
import type { EvmVerifyInfo } from "lib/types";
import { useMobile } from "lib/app-provider";
import { VerifiedDetails } from "./VerifiedDetails";
import { FailedDetails } from "./FailedDetails";
import { InProgressDetails } from "./InProgressDetails";

interface EvmVerifySectionProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
}

const EvmVerifySectionBody = ({
  contractAddress,
  evmVerifyInfo,
}: EvmVerifySectionProps) => {
  if (!evmVerifyInfo) {
    return <NotVerifiedDetails contractAddress={contractAddress} />;
  }

  const { errorMessage, isVerified } = evmVerifyInfo;

  if (errorMessage) {
    return (
      <FailedDetails
        contractAddress={contractAddress}
        evmVerifyInfo={evmVerifyInfo}
      />
    );
  }

  if (isVerified) {
    return <VerifiedDetails contractAddress={contractAddress} />;
  }

  return (
    <InProgressDetails
      contractAddress={contractAddress}
      evmVerifyInfo={evmVerifyInfo}
    />
  );
};

export const EvmVerifySection = (props: EvmVerifySectionProps) => {
  const isMobile = useMobile();

  return (
    <Flex
      pl={6}
      justifyContent="space-between"
      alignItems={isMobile ? "flex-start" : "center"}
      flexDirection={isMobile ? "column" : "row"}
      w="full"
      borderColor="primary.main"
      borderLeftWidth={4}
      gap={2}
    >
      <EvmVerifySectionBody {...props} />
    </Flex>
  );
};
