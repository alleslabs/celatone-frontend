import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

interface OptionButtonProps {
  description: string;
  disabled?: boolean;
  title: string;
}

export const OptionButton = ({
  description,
  disabled,
  title,
}: OptionButtonProps) => (
  <Flex
    _hover={{ bg: "gray.700" }}
    alignItems="center"
    bg="gray.800"
    borderRadius={8}
    cursor={disabled ? "not-allowed" : "pointer"}
    opacity={disabled ? 0.5 : 1}
    p={4}
    transition="all 0.25s ease-in-out"
    w="full"
  >
    <Flex direction="column" gap={1} w="full">
      <Text color="text.main" fontWeight={500} variant="body1">
        {title}
      </Text>
      <Text color="text.dark" variant="body2">
        {description}
      </Text>
    </Flex>
    <CustomIcon color="gray.600" name="chevron-right" />
  </Flex>
);

export const OptionButtonDisabled = ({
  description,
  title,
}: OptionButtonProps) => (
  <Flex
    _hover={{ bg: "gray.900" }}
    alignItems="center"
    bg="gray.900"
    borderRadius={8}
    cursor="not-allowed"
    p={4}
    transition="all 0.25s ease-in-out"
    w="full"
  >
    <Flex direction="column" gap={1} w="full">
      <Text color="text.disabled" fontWeight={500} variant="body1">
        {title}
      </Text>
      <Text color="text.disabled" variant="body2">
        {description}
      </Text>
    </Flex>
    <CustomIcon color="gray.600" name="chevron-right" />
  </Flex>
);
