import type { ValidatorData } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

interface ValidatorStatusProps {
  info: ValidatorData;
}
export const ValidatorStatusTag = ({ info }: ValidatorStatusProps) => {
  if (info.isActive) {
    return (
      <Flex
        alignItems="center"
        background="gray.900"
        borderRadius={8}
        gap={2}
        px={2}
        py={1}
      >
        <Flex background="success.main" borderRadius="full" h={3} w={3} />
        <Text color="text.main" variant="body3">
          Active
        </Text>
      </Flex>
    );
  }

  if (info.isJailed) {
    return (
      <Flex
        alignItems="center"
        background="gray.900"
        borderRadius={8}
        gap={2}
        px={2}
        py={1}
      >
        <Flex
          background="error.main"
          borderRadius="full"
          display="grid"
          h={3}
          placeItems="center"
          w={3}
        >
          <CustomIcon boxSize={1.5} color="black" margin={0} name="close" />
        </Flex>
        <Text color="text.main" variant="body3">
          Jailed
        </Text>
      </Flex>
    );
  }

  return (
    <Flex
      alignItems="center"
      background="gray.900"
      borderRadius={8}
      gap={2}
      px={2}
      py={1}
    >
      <Flex background="gray.600" borderRadius="full" h={3} w={3} />
      <Text color="text.main" variant="body3">
        Inactive
      </Text>
    </Flex>
  );
};
