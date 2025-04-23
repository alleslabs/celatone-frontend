import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

export const Emergency = () => {
  return (
    <Flex as="span" align="center">
      <CustomIcon name="alert-triangle" boxSize={4} ml={0} color="error.main" />
      <Text as="span" variant="body3" color="error.main">
        Emergency
      </Text>
    </Flex>
  );
};
