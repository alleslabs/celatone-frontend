import { Flex, Text } from "@chakra-ui/react";

import { useCurrentChain } from "lib/app-provider";
import { ConnectWalletBtn } from "lib/components/button";
import { EmptyState, StateImage } from "lib/components/state";

const DisconnectedState = () => (
  <Flex
    direction="column"
    alignItems="center"
    gap={4}
    py={12}
    borderY="1px solid"
    borderColor="gray.700"
  >
    <StateImage imageVariant="empty" />
    <Text variant="body1" color="text.dark">
      No contract instances from this code.
    </Text>
    <Flex align="center" alignItems="center">
      <Text variant="body1" color="text.dark" mr={2}>
        In order to instantiate contract from this code, you need to
      </Text>
      <ConnectWalletBtn />
    </Flex>
  </Flex>
);

export const NoContracts = () => {
  const { isWalletConnected } = useCurrentChain();
  return !isWalletConnected ? (
    <DisconnectedState />
  ) : (
    <EmptyState
      imageVariant="empty"
      message="No contract instances from this code."
      withBorder
    />
  );
};
