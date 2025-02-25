import { Alert, Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import type { HexAddr20, Option, EvmVerifyInfo } from "lib/types";

import { FailedDetails } from "./FailedDetails";
import { InProgressDetails } from "./InProgressDetails";
import { NotVerifiedDetails } from "./NotVerifiedDetails";
import { VerifiedDetails } from "./VerifiedDetails";

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
    <Alert variant="info-left-primary">
      <Flex
        w="full"
        justifyContent="space-between"
        alignItems={isMobile ? "flex-start" : "center"}
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
      >
        <EvmVerifySectionBody {...props} />
      </Flex>
    </Alert>
  );
};
