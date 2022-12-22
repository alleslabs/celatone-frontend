import { Flex, Text } from "@chakra-ui/react";

interface LabelTextProps {
  label: string;
  children: string | JSX.Element;
  helperText?: string;
}

export const LabelText = ({ label, children, helperText }: LabelTextProps) => {
  return (
    <Flex direction="column" gap={1}>
      <Text variant="body2" color="text.dark" fontWeight={500}>
        {label}
      </Text>
      {typeof children === "string" ? (
        <Text variant="body2">{children}</Text>
      ) : (
        children
      )}
      {helperText && (
        <Text variant="body3" color="text.dark">
          {helperText}
        </Text>
      )}
    </Flex>
  );
};
