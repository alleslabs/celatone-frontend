import { Flex } from "@chakra-ui/react";
import { CustomNetworkSubheader } from "lib/components/custom-network";

export const UpdateSupportedFeatures = () => {
  return (
    <Flex direction="column" gap={6}>
      <CustomNetworkSubheader
        subtitle="Choose supported features for your custom rollup"
        title="Feature lists"
      />
      <Flex bg="teal">form goes here</Flex>
    </Flex>
  );
};
