import { Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { ConnectWalletBtn } from "lib/components/button/ConnectWallet";

const DisconnectedState = () => (
  <Flex align="center" justify="center">
    No contract instances from this code. In order to instantiate contract from
    this code, you need to
    <ConnectWalletBtn />
  </Flex>
);

const EmptyState = () => (
  // TODO: add instantiate button
  <Flex align="center" justify="center">
    No contract instances from this code.
  </Flex>
);

export const NoContracts = () => {
  const { isWalletConnected } = useWallet();
  return !isWalletConnected ? <DisconnectedState /> : <EmptyState />;
};
