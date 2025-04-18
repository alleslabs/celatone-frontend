import type { FlexProps } from "@chakra-ui/react";

import { Flex, Text } from "@chakra-ui/react";

import { TooltipInfo } from "./Tooltip";

export interface LabelTextProps extends FlexProps {
  label: string;
  labelWeight?: number;
  labelColor?: string;
  isSmall?: boolean;
  tooltipText?: string;
  children?: string | JSX.Element;
  helperText1?: string;
  helperText2?: string;
  minWidth?: string;
}

export const LabelText = ({
  children,
  helperText1,
  helperText2,
  isSmall = false,
  label,
  labelColor = "text.dark",
  labelWeight = 500,
  minWidth,
  tooltipText,
  ...flexProps
}: LabelTextProps) => (
  <Flex direction="column" gap={1} {...flexProps}>
    <Flex align="center" gap={1} minWidth={minWidth}>
      <Text
        color={labelColor}
        fontWeight={labelWeight}
        variant={isSmall ? "body3" : "body2"}
      >
        {label}
      </Text>
      {tooltipText && <TooltipInfo label={tooltipText} />}
    </Flex>
    {typeof children === "string" ? (
      <Text overflowWrap="anywhere" variant={isSmall ? "body3" : "body2"}>
        {children}
      </Text>
    ) : (
      children
    )}
    {helperText1 && (
      <Text color={labelColor} variant="body3">
        {helperText1}
      </Text>
    )}
    {helperText2 && (
      <Text color={labelColor} variant="body3">
        {helperText2}
      </Text>
    )}
  </Flex>
);
