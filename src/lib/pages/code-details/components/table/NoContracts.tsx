import { Box, Flex, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { ConnectWalletBtn } from "lib/components/button";

const DisconnectedState = () => (
  <Flex direction="column" alignItems="center" gap="16px">
    <Text variant="body1" color="text.dark">
      No contract instances from this code.
    </Text>
    <Flex align="center" alignItems="center">
      <Text variant="body1" color="text.dark" mr="8px">
        In order to instantiate contract from this code, you need to
      </Text>
      <ConnectWalletBtn />
    </Flex>
  </Flex>
);

const EmptyState = () => (
  <Flex align="center" justify="center">
    No contract instances from this code.
  </Flex>
);

export const NoContracts = () => {
  const { isWalletConnected } = useWallet();
  return (
    <Box py="48px" borderY="1px solid" borderColor="pebble.700">
      {!isWalletConnected ? <DisconnectedState /> : <EmptyState />}
    </Box>
  );
};
