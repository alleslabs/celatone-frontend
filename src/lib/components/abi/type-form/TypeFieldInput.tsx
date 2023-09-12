import { Flex, Input, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

interface TypeFieldInputProps {
  index: number;
  value: string;
  constraints: string[];
  onChange: (value: string) => void;
}

export const TypeFieldInput = ({
  index,
  value,
  constraints,
  onChange,
}: TypeFieldInputProps) => {
  const placeholder = `Ability : ${
    constraints.length
      ? constraints.map((constraint) => capitalize(constraint)).join(" + ")
      : "none"
  }`;

  return (
    <Flex
      bgColor="gray.900"
      borderRadius="8px"
      p="8px 16px"
      gap={2}
      alignItems="center"
    >
      <Text variant="body1" fontWeight={700} w={7}>
        {`T${index}:`}
      </Text>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          onChange(newValue);
        }}
      />
    </Flex>
  );
};
