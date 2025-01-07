import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { TooltipInfo } from "./Tooltip";

export interface LabelTextProps extends FlexProps {
  children?: JSX.Element | string;
  helperText1?: string;
  helperText2?: string;
  isSmall?: boolean;
  label: string;
  labelColor?: string;
  labelWeight?: number;
  tooltipText?: string;
}

export const LabelText = ({
  children,
  helperText1,
  helperText2,
  isSmall = false,
  label,
  labelColor = "text.dark",
  labelWeight = 500,
  tooltipText,
  ...flexProps
}: LabelTextProps) => (
  <Flex gap={1} direction="column" {...flexProps}>
    <Flex align="center" gap={1}>
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
