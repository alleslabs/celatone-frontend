import { Flex } from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateNetworkDetails = () => {
  return (
    <Flex direction="column" gap={6}>
      <CustomNetworkSubheader
        title="Network Details"
        subtitle="Enter the Rollup’s general information and gather data touch points"
      />
      <Flex bg="teal">form goes here</Flex>
    </Flex>
  );
};
