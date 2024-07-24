import { Button, Flex } from "@chakra-ui/react";

import { CustomNetworkSubheader } from "lib/components/custom-network";
import { CustomIcon } from "lib/components/icon";

export const ExportNetworkConfig = () => {
  return (
    <Flex gap={12} direction="column">
      <Flex>
        <CustomNetworkSubheader
          title="Export as JSON File"
          subtitle="You can export this Custom Minitia configuration in JSON file to use them in other device."
        />
        <Button minW={168} leftIcon={<CustomIcon name="download" />}>
          Export as JSON
        </Button>
      </Flex>
      <Flex direction="column" gap={2}>
        <CustomNetworkSubheader title="Current Configuration in JSON" />
        <Flex bg="teal">JSON</Flex>
      </Flex>
    </Flex>
  );
};
