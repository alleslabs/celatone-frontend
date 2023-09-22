import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { TooltipInfo } from "./Tooltip";

interface LabelTextProps extends FlexProps {
  label: string;
  labelWeight?: number;
  isSmall?: boolean;
  tooltipText?: string;
  children: string | JSX.Element;
  helperText1?: string;
  helperText2?: string;
}

export const LabelText = ({
  label,
  labelWeight = 500,
  isSmall = false,
  tooltipText,
  children,
  helperText1,
  helperText2,
  ...flexProps
}: LabelTextProps) => (
  <Flex direction="column" gap={1} {...flexProps}>
    <Flex align="center" gap={1}>
      <Text
        variant={isSmall ? "body3" : "body2"}
        color="text.dark"
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
      <Text variant="body3" color="text.dark">
        {helperText1}
      </Text>
    )}
    {helperText2 && (
      <Text variant="body3" color="text.dark">
        {helperText2}
      </Text>
    )}
  </Flex>
);
