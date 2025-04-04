import { Flex } from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateWalletRegistry = () => {
  return (
    <Flex direction="column" gap={8}>
      <Flex direction="column" gap={6}>
        <CustomNetworkSubheader title="Account prefix and registered coin type" />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
      <Flex direction="column" gap={6}>
        <CustomNetworkSubheader
          title="Assets"
          subtitle="List the available supported tokens in this network"
        />
        <Flex bg="teal">form goes here</Flex>
      </Flex>
    </Flex>
  );
};
