import type { FlexProps } from "@chakra-ui/react";
import { Flex, Heading, Stack, Tag, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

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
    align="center"
    aria-disabled={disabled}
    justify="space-between"
    p={6}
    w="100%"
    _hover={{ bgColor: "gray.700" }}
    bgColor="gray.800"
    borderRadius="8px"
    cursor="pointer"
    onClick={!disabled ? onClick : undefined}
    transition="all 0.25s ease-in-out"
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
