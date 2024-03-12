import { Divider, Flex } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

export const DividerWithArrow = () => (
  <Flex gap={2} alignItems="center" py={3}>
    <Divider borderColor="accent.main" />
    <CustomIcon name="arrow-down" boxSize={4} color="accent.main" />
    <Divider borderColor="accent.main" />
  </Flex>
);
