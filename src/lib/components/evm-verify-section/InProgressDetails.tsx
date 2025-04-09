import { Button, Text } from "@chakra-ui/react";

import type { HexAddr20, EvmVerifyInfo } from "lib/types";
import { EvmVerifyStatusModalWithTrigger } from "../modal/evm-verify-status";

interface InProgressDetailsProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: EvmVerifyInfo;
}

export const InProgressDetails = ({
  contractAddress,
  evmVerifyInfo,
}: InProgressDetailsProps) => (
  <>
    <Text variant="body2" color="text.dark">
      Contract verification is in progress and may take several hours depending
      on contract complexity.
    </Text>
    <EvmVerifyStatusModalWithTrigger
      contractAddress={contractAddress}
      evmVerifyInfo={evmVerifyInfo}
      triggerElement={
        <Button variant="ghost-primary" size="sm">
          View verification details
        </Button>
      }
    />
  </>
);
