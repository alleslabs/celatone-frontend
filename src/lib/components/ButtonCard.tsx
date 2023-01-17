import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";

interface ButtonCardInterface extends FlexProps {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}

export const ButtonCard = ({
  title,
  description,
  onClick,
  disabled,
  ...componentProps
}: ButtonCardInterface) => {
  return (
    <Flex
      aria-disabled={disabled}
      p="24px"
      align="center"
      justify="space-between"
      onClick={onClick}
      bgColor="gray.900"
      borderRadius="4px 4px 0 0"
      w="100%"
      cursor="pointer"
      _hover={{ bgColor: "rgba(255, 255, 255, 0.15)" }}
      _disabled={{
        bgColor: "rgba(255, 255, 255, 0.12)",
        cursor: "not-allowed",
      }}
      {...componentProps}
    >
      <Stack>
        <Heading
          as="h6"
          variant="h6"
          color={disabled ? "text.disabled" : "text.main"}
        >
          {title}
        </Heading>
        <Text variant="body2" color={disabled ? "text.disabled" : "text.main"}>
          {description}
        </Text>
      </Stack>
      <Icon as={FiChevronRight} color="gray.600" fontSize="28px" />
    </Flex>
  );
};
