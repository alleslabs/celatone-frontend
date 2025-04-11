import { Flex, Heading } from "@chakra-ui/react";

import type { IconKeys } from "./icon";

import { CustomIcon } from "./icon";

export const ValueWithIcon = ({
  icon,
  value,
}: {
  icon: IconKeys;
  value: string;
}) => (
  <Flex alignItems="center" gap={2}>
    <CustomIcon boxSize={6} color="primary.main" name={icon} />
    <Heading as="h4" variant={{ base: "h5", md: "h4" }}>
      {value}
    </Heading>
  </Flex>
);
