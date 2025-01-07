import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface OptionButtonProps {
  description: string;
  title: string;
}

export const OptionButton = ({ description, title }: OptionButtonProps) => (
  <Flex
    alignItems="center"
    bg="gray.800"
    p={4}
    w="full"
    _hover={{ bg: "gray.700" }}
    borderRadius={8}
    cursor="pointer"
    transition="all 0.25s ease-in-out"
  >
    <Flex gap={1} w="full" direction="column">
      <Text variant="body1" color="text.main" fontWeight={500}>
        {title}
      </Text>
      <Text variant="body2" color="text.dark">
        {description}
      </Text>
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);

export const OptionButtonDisabled = ({
  description,
  title,
}: OptionButtonProps) => (
  <Flex
    alignItems="center"
    bg="gray.900"
    p={4}
    w="full"
    _hover={{ bg: "gray.900" }}
    borderRadius={8}
    cursor="not-allowed"
    transition="all 0.25s ease-in-out"
  >
    <Flex gap={1} w="full" direction="column">
      <Text variant="body1" color="text.disabled" fontWeight={500}>
        {title}
      </Text>
      <Text variant="body2" color="text.disabled">
        {description}
      </Text>
    </Flex>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);
