import { Flex, Badge } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

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
        <Badge
          bgColor="transparent"
          border="1px solid"
          borderColor="primary.main"
          textColor="text.main"
        >
          <s>0</s>
        </Badge>
        <Badge
          bgColor="transparent"
          border="1px solid"
          borderColor="accent.dark"
          textColor="text.main"
        >
          <s>0</s>
        </Badge>
      </Flex>
    </Flex>
  );
};
