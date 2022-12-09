import { Flex, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";
import { MdSearchOff } from "react-icons/md";

interface EmptyStateProps {
  icon?: IconType;
  message: string;
}

export const EmptyState = ({
  icon = MdSearchOff,
  message,
}: EmptyStateProps) => {
  return (
    <Flex alignItems="center" flexDir="column" gap="4">
      <Icon as={icon} color="gray.600" boxSize="16" />
      <Text color="gray.500" w="440px" textAlign="center">
        {message}
      </Text>
    </Flex>
  );
};
