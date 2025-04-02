import type { HexAddr20, EvmVerifyInfo } from "lib/types";

import { Button, Text } from "@chakra-ui/react";

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
    <Text color="text.dark" variant="body2">
      Contract verification is in progress and may take several hours depending
      on contract complexity.
    </Text>
    <EvmVerifyStatusModalWithTrigger
      contractAddress={contractAddress}
      evmVerifyInfo={evmVerifyInfo}
      triggerElement={
        <Button size="sm" variant="ghost-primary">
          View Verification Details
        </Button>
      }
    />
  </>
);
