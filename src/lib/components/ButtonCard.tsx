import type { FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { Flex, Heading, Stack, Tag, Text } from "@chakra-ui/react";

import { CustomIcon } from "./icon";

interface ButtonCardProps extends FlexProps {
  description: ReactNode;
  disabled?: boolean;
  hasIcon?: boolean;
  onClick: () => void;
  tagLabel?: string;
  title: string;
}

export const ButtonCard = ({
  description,
  disabled,
  hasIcon = true,
  onClick,
  tagLabel,
  title,
  ...componentProps
}: ButtonCardProps) => (
  <Flex
    _disabled={{
      bgColor: "gray.900",
      cursor: "not-allowed",
    }}
    _hover={{ bgColor: "gray.700" }}
    align="center"
    aria-disabled={disabled}
    bgColor="gray.800"
    borderRadius="8px"
    cursor="pointer"
    justify="space-between"
    p={6}
    transition="all 0.25s ease-in-out"
    w="100%"
    onClick={!disabled ? onClick : undefined}
    {...componentProps}
  >
    <Stack>
      <Flex alignItems="center" gap={2}>
        <Heading
          as="h6"
          color={disabled ? "text.disabled" : "text.main"}
          variant="h6"
        >
          {title}
        </Heading>
        {tagLabel && <Tag size="sm">{tagLabel}</Tag>}
      </Flex>
      {typeof description === "string" ? (
        <Text color={disabled ? "text.disabled" : "text.main"} variant="body2">
          {description}
        </Text>
      ) : (
        description
      )}
    </Stack>
    {hasIcon && <CustomIcon color="gray.600" name="chevron-right" />}
  </Flex>
);
