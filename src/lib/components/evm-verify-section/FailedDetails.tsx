import { Button, HStack, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { EvmVerifyInfo } from "lib/types";
import type { HexAddr20 } from "lib/types";
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
        <Text variant="body2" color="text.dark">
          Verification failed: Verification was submitted on{" "}
          {formatUTC(evmVerifyInfo.submittedTimestamp)} but an error occurred.
        </Text>
        <Text variant="body2" color="text.dark">
          If you are the owner, you can reverify this contract on the desktop
          interface.
        </Text>
        <EvmVerifyStatusModalWithTrigger
          contractAddress={contractAddress}
          evmVerifyInfo={evmVerifyInfo}
          triggerElement={
            <Button variant="ghost-primary" size="sm">
              Verify Details
            </Button>
          }
        />
      </>
    );

  return (
    <>
      <Text variant="body2" color="text.dark">
        Verification failed: Verification was submitted on{" "}
        {formatUTC(evmVerifyInfo.submittedTimestamp)} but an error occurred.
      </Text>
      <HStack>
        <EvmVerifyStatusModalWithTrigger
          contractAddress={contractAddress}
          evmVerifyInfo={evmVerifyInfo}
          triggerElement={
            <Button variant="ghost-primary" size="sm">
              Verify Details
            </Button>
          }
        />
        <Button variant="ghost-primary" size="sm" onClick={handleNavigate}>
          Verify Again
        </Button>
      </HStack>
    </>
  );
};
