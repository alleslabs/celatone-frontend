import { Flex, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";

interface EmptyStateProps {
  icon?: IconType;
  message: string;
}

export const EmptyState = ({ icon, message }: EmptyStateProps) => {
  return (
    <Flex alignItems="center" flexDir="column" gap="4" width="full">
      {icon && <Icon as={icon} color="pebble.600" boxSize="16" />}
      <Text color="text.dark" w="540px" textAlign="center">
        {message}
      </Text>
    </Flex>
  );
};
