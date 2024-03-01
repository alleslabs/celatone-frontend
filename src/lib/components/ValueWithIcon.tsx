import { Flex, Heading } from "@chakra-ui/react";

import { CustomIcon } from "./icon";
import type { IconKeys } from "./icon";

export const ValueWithIcon = ({
  icon,
  value,
}: {
  icon: IconKeys;
  value: string;
}) => (
  <Flex alignItems="center" gap={2}>
    <CustomIcon name={icon} boxSize={6} color="secondary.main" />
    <Heading as="h4" variant={{ base: "h5", md: "h4" }}>
      {value}
    </Heading>
  </Flex>
);
