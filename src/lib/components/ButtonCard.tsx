import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading, Icon, Stack, Text } from "@chakra-ui/react";
import { MdChevronRight } from "react-icons/md";

interface ButtonCardProps extends FlexProps {
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
}: ButtonCardProps) => (
  <Flex
    aria-disabled={disabled}
    p="24px"
    align="center"
    justify="space-between"
    onClick={!disabled ? onClick : undefined}
    bgColor="pebble.800"
    borderRadius="8px"
    w="100%"
    cursor="pointer"
    _hover={{ bgColor: "pebble.700" }}
    transition="all .25s ease-in-out"
    _disabled={{
      bgColor: "pebble.800",
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
    <Icon as={MdChevronRight} color="pebble.600" fontSize="28px" />
  </Flex>
);
