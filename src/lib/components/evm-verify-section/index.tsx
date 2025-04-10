import type { HexAddr20, Option, EvmVerifyInfo } from "lib/types";

import { Alert, Flex, Text } from "@chakra-ui/react";
import { useIsApiChain, useMobile } from "lib/app-provider";

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
  const isApiChain = useIsApiChain({ shouldRedirect: false });

  if (!isApiChain)
    return (
      <Text color="text.dark" variant="body2">
        Contract verification is only available on official networks
      </Text>
    );

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
        alignItems={isMobile ? "flex-start" : "center"}
        flexDirection={isMobile ? "column" : "row"}
        gap={2}
        justifyContent="space-between"
        w="full"
      >
        <EvmVerifySectionBody {...props} />
      </Flex>
    </Alert>
  );
};
