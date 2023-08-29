import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

import { CountBadge } from "./CountBadge";

export const ModuleCard = () => {
  return (
    <Flex
      borderRadius={8}
      bgColor="gray.800"
      p={2}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex alignItems="center" gap={1}>
        <CustomIcon name="contract-address" color="primary.main" boxSize={3} />
        Module name
        <CustomIcon
          name="check-circle-solid"
          color="success.main"
          boxSize={3}
        />
      </Flex>
      <Flex gap={1}>
        <CountBadge count={12} variant="view" />
        <CountBadge count={0} variant="execute" />
      </Flex>
    </Flex>
  );
};
