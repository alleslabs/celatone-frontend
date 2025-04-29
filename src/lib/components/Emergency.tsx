import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const Emergency = () => (
  <Flex align="center" as="span">
    <CustomIcon boxSize={3} color="error.main" ml={0} name="alert-triangle" />
    <Text as="span" color="error.main" variant="body3">
      Emergency
    </Text>
  </Flex>
);
