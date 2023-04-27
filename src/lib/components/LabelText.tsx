import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import type { ForwardedRef } from "react";
import { forwardRef } from "react";

interface LabelTextProps extends FlexProps {
  label: string;
  children: string | JSX.Element;
  helperText1?: string;
  helperText2?: string;
}
export const LabelText = forwardRef(
  (
    { label, children, helperText1, helperText2, ...flexProps }: LabelTextProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <Flex direction="column" gap={1} ref={ref} {...flexProps}>
      <Text variant="body2" color="text.dark" fontWeight={500}>
        {label}
      </Text>
      {typeof children === "string" ? (
        <Text variant="body2">{children}</Text>
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
  )
);
