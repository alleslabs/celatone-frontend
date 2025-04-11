import { Flex } from "@chakra-ui/react";
import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateNetworkDetails = () => {
  return (
    <Flex direction="column" gap={6}>
      <CustomNetworkSubheader
        subtitle="Enter the rollup’s general information and gather data touch points"
        title="Network details"
      />
      <Flex bg="teal">form goes here</Flex>
    </Flex>
  );
};
