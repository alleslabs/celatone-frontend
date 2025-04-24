import { Flex, Tag, Text } from "@chakra-ui/react";

interface TypeLabelProps {
  children?: JSX.Element;
  isRequired?: boolean;
  label?: string;
  type?: string;
}

export const TypeLabel = ({
  children,
  isRequired = false,
  label,
  type,
}: TypeLabelProps) => {
  if (!label && !type) return children;
  return (
    <Flex direction="column" gap={2} width="full">
      <Flex align="center" gap="1">
        <Text
          fontWeight={700}
          textColor={label ? "text.main" : "text.dark"}
          variant="body3"
        >
          {label} {isRequired && <span style={{ color: "red" }}>*</span>}
        </Text>
        {type && (
          <Tag size="xs" variant="gray">
            {type}
          </Tag>
        )}
      </Flex>
      {children}
    </Flex>
  );
};
