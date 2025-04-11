import { Divider, Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const DividerWithArrow = () => (
  <Flex alignItems="center" gap={2} py={3}>
    <Divider borderColor="primary.main" />
    <CustomIcon boxSize={4} color="primary.main" name="arrow-down" />
    <Divider borderColor="primary.main" />
  </Flex>
);
