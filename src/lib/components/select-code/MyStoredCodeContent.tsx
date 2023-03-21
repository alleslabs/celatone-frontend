import { Flex, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { Loading } from "../Loading";
import { ConnectWalletBtn } from "lib/components/button";
import { EmptyState } from "lib/components/state";
import type { CodeInfo } from "lib/types";

import { CodesReadOnlyTable } from "./CodesReadOnlyTable";

interface MyStoredCodeContentProps {
  handleSelect: (code: string) => void;
  storedCodes: CodeInfo[];
  isLoading: boolean;
}

export const MyStoredCodeContent = ({
  handleSelect,
  storedCodes,
  isLoading,
}: MyStoredCodeContentProps) => {
  const { address } = useWallet();
  if (!address) {
    return (
      <Flex
        align="center"
        py={6}
        direction="column"
        gap={2}
        borderY="1px solid"
        borderColor="pebble.700"
      >
        <Text variant="body1" color="text.main">
          Connect your wallet to upload and see your stored Codes.
        </Text>
        <ConnectWalletBtn />
      </Flex>
    );
  }
  if (isLoading) return <Loading />;
  if (!storedCodes.length) {
    return <EmptyState message="You don’t have any stored codes." withBorder />;
  }
  return <CodesReadOnlyTable onCodeSelect={handleSelect} codes={storedCodes} />;
};
