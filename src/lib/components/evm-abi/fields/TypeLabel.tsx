import { Flex, Tag, Text } from "@chakra-ui/react";

interface TypeLabelProps {
  label?: string;
  type?: string;
  isRequired?: boolean;
  children?: JSX.Element;
}

export const TypeLabel = ({
  label,
  type,
  isRequired = false,
  children,
}: TypeLabelProps) => {
  if (!label && !type) return children;
  return (
    <Flex width="full" direction="column" gap={2}>
      <Flex align="center" gap="1">
        <Text
          variant="body3"
          textColor={label ? "text.main" : "text.dark"}
          fontWeight={700}
        >
          {label} {isRequired && <span style={{ color: "red" }}>*</span>}
        </Text>
        {type && (
          <Tag variant="gray" size="xs">
            {type}
          </Tag>
        )}
      </Flex>
      {children}
    </Flex>
  );
};
