import { Flex } from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateSupportedFeatures = () => {
  return (
    <Flex gap={6} direction="column">
      <CustomNetworkSubheader
        subtitle="Choose supported features for your custom Minitia"
        title="Feature Lists"
      />
      <Flex bg="teal">form goes here</Flex>
    </Flex>
  );
};
