import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface OptionButtonProps {
  title: string;
  description: string;
}

export const OptionButton = ({ title, description }: OptionButtonProps) => (
  <Flex
    alignItems="center"
    w="full"
    bg="gray.800"
    p={4}
    borderRadius={8}
    transition="all 0.25s ease-in-out"
    cursor="pointer"
    _hover={{ bg: "gray.700" }}
  >
    <Flex direction="column" gap={1} w="full">
      <Text color="text.main" variant="body1" fontWeight={500}>
        {title}
      </Text>
      <Text color="text.dark" variant="body2">
        {description}
      </Text>
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);

export const OptionButtonDisabled = ({
  title,
  description,
}: OptionButtonProps) => (
  <Flex
    alignItems="center"
    w="full"
    bg="gray.900"
    p={4}
    borderRadius={8}
    transition="all 0.25s ease-in-out"
    cursor="not-allowed"
    _hover={{ bg: "gray.900" }}
  >
    <Flex direction="column" gap={1} w="full">
      <Text color="text.disabled" variant="body1" fontWeight={500}>
        {title}
      </Text>
      <Text color="text.disabled" variant="body2">
        {description}
      </Text>
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);
