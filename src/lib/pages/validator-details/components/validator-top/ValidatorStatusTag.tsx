import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { ValidatorData } from "lib/types";

interface ValidatorStatusProps {
  info: ValidatorData;
}
export const ValidatorStatusTag = ({ info }: ValidatorStatusProps) => {
  if (info.isActive) {
    return (
      <Flex
        background="gray.900"
        borderRadius={8}
        py={1}
        px={2}
        alignItems="center"
        gap={2}
      >
        <Flex h={3} w={3} borderRadius="full" background="success.main" />
        <Text variant="body3" color="text.main">
          Active
        </Text>
      </Flex>
    );
  }

  if (info.isJailed) {
    return (
      <Flex
        background="gray.900"
        borderRadius={8}
        py={1}
        px={2}
        alignItems="center"
        gap={2}
      >
        <Flex
          h={3}
          w={3}
          borderRadius="full"
          background="error.main"
          display="grid"
          placeItems="center"
        >
          <CustomIcon name="close" color="black" boxSize={1.5} margin={0} />
        </Flex>
        <Text variant="body3" color="text.main">
          Jailed
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      background="gray.900"
      borderRadius={8}
      py={1}
      px={2}
      alignItems="center"
      gap={2}
    >
      <Flex h={3} w={3} borderRadius="full" background="gray.600" />
      <Text variant="body3" color="text.main">
        Inactive
      </Text>
    </Flex>
  );
};
