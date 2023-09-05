import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface UploadModuleCardProps {
  index: number;
  remove: () => void;
  fieldAmount: number;
}
export const UploadModuleCard = ({
  index,
  remove,
  fieldAmount,
}: UploadModuleCardProps) => {
  return (
    <Flex
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      p={4}
      gap={4}
      flexDirection="column"
    >
      <Flex justifyContent="space-between" w="full" alignItems="center">
        <Heading as="h6" variant="h6" color="text.dark" fontWeight={800}>
          Module {index + 1}
        </Heading>
        <IconButton
          onClick={remove}
          aria-label="remove"
          variant="ghost"
          size="sm"
          disabled={fieldAmount <= 1}
        >
          <CustomIcon name="close" color="gray.600" />
        </IconButton>
      </Flex>
      {/* UPLOAD CARD */}
      add upload card here
      <Flex justifyContent="space-between" w="full">
        <Text variant="body2" color="text.dark">
          Module Path
        </Text>
        <Text variant="body2" color="text.dark">
          -
        </Text>
      </Flex>
    </Flex>
  );
};
