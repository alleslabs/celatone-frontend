import { Divider, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const LiquidityDivider = () => (
  <Flex gap={2} alignItems="center">
    <Divider borderColor="honeydew.main" />
    <CustomIcon name="arrow-down" boxSize={4} color="honeydew.main" />
    <Divider borderColor="honeydew.main" />
  </Flex>
);
