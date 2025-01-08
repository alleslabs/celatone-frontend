import { Flex } from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateWalletRegistry = () => {
  return (
    <Flex gap={8} direction="column">
      <Flex gap={6} direction="column">
        <CustomNetworkSubheader title="Account Prefix and Registered Coin Type" />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
      <Flex gap={6} direction="column">
        <CustomNetworkSubheader
          subtitle="List the available supported tokens in this network"
          title="Assets"
        />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
    </Flex>
  );
};
