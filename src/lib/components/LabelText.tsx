import { Flex, Text } from "@chakra-ui/react";

interface LabelTextProps {
  label: string;
  children: string | JSX.Element;
  helperText1?: string;
  helperText2?: string;
}

export const LabelText = ({
  label,
  children,
  helperText1,
  helperText2,
}: LabelTextProps) => (
  <Flex direction="column" gap={1}>
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
);
