import type { EvmVerifyInfo, HexAddr20 } from "lib/types";

import { Button, HStack, Text } from "@chakra-ui/react";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { formatUTC } from "lib/utils";

import { EvmVerifyStatusModalWithTrigger } from "../modal/evm-verify-status";

interface FailedDetailsProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: EvmVerifyInfo;
}

export const FailedDetails = ({
  contractAddress,
  evmVerifyInfo,
}: FailedDetailsProps) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();

  const handleNavigate = () =>
    navigate({
      pathname: "/evm-contracts/verify",
      query: { contractAddress },
    });

  if (isMobile)
    return (
      <>
        <Text color="text.dark" variant="body2">
          Verification failed: Verification was submitted on{" "}
          {formatUTC(evmVerifyInfo.submittedTimestamp)} but an error occurred.
        </Text>
        <Text color="text.dark" variant="body2">
          If you are the owner, you can reverify this contract on the desktop
          interface.
        </Text>
        <EvmVerifyStatusModalWithTrigger
          contractAddress={contractAddress}
          evmVerifyInfo={evmVerifyInfo}
          triggerElement={
            <Button size="sm" variant="ghost-primary">
              Verify Details
            </Button>
          }
        />
      </>
    );

  return (
    <>
      <Text color="text.dark" variant="body2">
        Verification failed: Verification was submitted on{" "}
        {formatUTC(evmVerifyInfo.submittedTimestamp)} but an error occurred.
      </Text>
      <HStack>
        <EvmVerifyStatusModalWithTrigger
          contractAddress={contractAddress}
          evmVerifyInfo={evmVerifyInfo}
          triggerElement={
            <Button size="sm" variant="ghost-primary">
              Verify Details
            </Button>
          }
        />
        <Button size="sm" variant="ghost-primary" onClick={handleNavigate}>
          Verify Again
        </Button>
      </HStack>
    </>
  );
};
