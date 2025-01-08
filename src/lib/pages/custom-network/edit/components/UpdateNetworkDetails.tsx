import { Flex } from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateNetworkDetails = () => {
  return (
    <Flex gap={6} direction="column">
      <CustomNetworkSubheader
        subtitle="Enter the Minitia’s general information and gather data touch points"
        title="Network Details"
      />
      <Flex bg="teal">form goes here</Flex>
    </Flex>
  );
};
