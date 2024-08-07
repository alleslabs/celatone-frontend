import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading, Stack, Tag, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { CustomIcon } from "./icon";

interface ButtonCardProps extends FlexProps {
  title: string;
  description: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tagLabel?: string;
  hasIcon?: boolean;
}

export const ButtonCard = ({
  title,
  description,
  onClick,
  disabled,
  tagLabel,
  hasIcon = true,
  ...componentProps
}: ButtonCardProps) => (
  <Flex
    aria-disabled={disabled}
    p={6}
    align="center"
    justify="space-between"
    onClick={!disabled ? onClick : undefined}
    bgColor="gray.800"
    borderRadius="8px"
    w="100%"
    cursor="pointer"
    _hover={{ bgColor: "gray.700" }}
    transition="all 0.25s ease-in-out"
    _disabled={{
      bgColor: "gray.900",
      cursor: "not-allowed",
    }}
    {...componentProps}
  >
    <Stack>
      <Flex alignItems="center" gap={2}>
        <Heading
          as="h6"
          variant="h6"
          color={disabled ? "text.disabled" : "text.main"}
        >
          {title}
        </Heading>
        {tagLabel && <Tag size="sm">{tagLabel}</Tag>}
      </Flex>
      {typeof description === "string" ? (
        <Text variant="body2" color={disabled ? "text.disabled" : "text.main"}>
          {description}
        </Text>
      ) : (
        description
      )}
    </Stack>
    {hasIcon && <CustomIcon name="chevron-right" color="gray.600" />}
  </Flex>
);
