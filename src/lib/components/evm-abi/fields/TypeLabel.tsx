import { Flex, Tag, Text } from "@chakra-ui/react";
import { JSX } from "react";

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
