import { Flex, Text } from "@chakra-ui/react";

import { useCurrentChain, useMobile } from "lib/app-provider";
import { ConnectWalletBtn } from "lib/components/button";
import { EmptyState, StateImage } from "lib/components/state";

const DisconnectedState = () => {
  const isMobile = useMobile();
  return (
    <Flex
      alignItems="center"
      gap={4}
      py={12}
      borderColor="gray.700"
      borderY="1px solid"
      direction="column"
    >
      <StateImage imageVariant="empty" />
      <Text variant="body1" color="text.dark">
        No contract instances from this code.
      </Text>
      {!isMobile && (
        <Flex align="center" alignItems="center">
          <Text mr={2} variant="body1" color="text.dark">
            In order to instantiate contract from this code, you need to
          </Text>
          <ConnectWalletBtn />
        </Flex>
      )}
    </Flex>
  );
};

export const NoContracts = () => {
  const { address } = useCurrentChain();
  return !address ? (
    <DisconnectedState />
  ) : (
    <EmptyState
      imageVariant="empty"
      message="No contract instances from this code."
      withBorder
    />
  );
};
