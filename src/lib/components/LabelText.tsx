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
  label,
  labelWeight = 500,
  isSmall = false,
  labelColor = "text.dark",
  tooltipText,
  children,
  helperText1,
  helperText2,
  minWidth,
  ...flexProps
}: LabelTextProps) => (
  <Flex direction="column" gap={1} {...flexProps}>
    <Flex align="center" gap={1} minWidth={minWidth}>
      <Text
        variant={isSmall ? "body3" : "body2"}
        color={labelColor}
        fontWeight={labelWeight}
      >
        {label}
      </Text>
      {tooltipText && <TooltipInfo label={tooltipText} />}
    </Flex>
    {typeof children === "string" ? (
      <Text variant={isSmall ? "body3" : "body2"} overflowWrap="anywhere">
        {children}
      </Text>
    ) : (
      children
    )}
    {helperText1 && (
      <Text variant="body3" color={labelColor}>
        {helperText1}
      </Text>
    )}
    {helperText2 && (
      <Text variant="body3" color={labelColor}>
        {helperText2}
      </Text>
    )}
  </Flex>
);
