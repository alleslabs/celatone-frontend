import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { CustomIcon } from "./icon";

interface ButtonCardProps extends FlexProps {
  title: string;
  description: ReactNode;
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
    bgColor="gray.800"
    borderRadius="8px"
    w="100%"
    cursor="pointer"
    _hover={{ bgColor: "gray.700" }}
    transition="all .25s ease-in-out"
    _disabled={{
      bgColor: "gray.900",
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
      {typeof description === "string" ? (
        <Text variant="body2" color={disabled ? "text.disabled" : "text.main"}>
          {description}
        </Text>
      ) : (
        description
      )}
    </Stack>
    <CustomIcon name="chevron-right" color="gray.600" />
  </Flex>
);
