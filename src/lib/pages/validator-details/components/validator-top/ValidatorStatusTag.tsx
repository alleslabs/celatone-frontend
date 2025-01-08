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
        alignItems="center"
        gap={2}
        px={2}
        py={1}
        background="gray.900"
        borderRadius={8}
      >
        <Flex h={3} w={3} background="success.main" borderRadius="full" />
        <Text variant="body3" color="text.main">
          Active
        </Text>
      </Flex>
    );
  }

  if (info.isJailed) {
    return (
      <Flex
        alignItems="center"
        gap={2}
        px={2}
        py={1}
        background="gray.900"
        borderRadius={8}
      >
        <Flex
          display="grid"
          h={3}
          placeItems="center"
          w={3}
          background="error.main"
          borderRadius="full"
        >
          <CustomIcon margin={0} name="close" boxSize={1.5} color="black" />
        </Flex>
        <Text variant="body3" color="text.main">
          Jailed
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      alignItems="center"
      gap={2}
      px={2}
      py={1}
      background="gray.900"
      borderRadius={8}
    >
      <Flex h={3} w={3} background="gray.600" borderRadius="full" />
      <Text variant="body3" color="text.main">
        Inactive
      </Text>
    </Flex>
  );
};
