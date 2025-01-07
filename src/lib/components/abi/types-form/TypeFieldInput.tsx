import { Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useState } from "react";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";

import type { AbiFormData } from "lib/types";

interface TypeFieldInputProps {
  constraints: string[];
  control: Control<AbiFormData["typeArgs"]>;
  index: number;
}

export const TypeFieldInput = ({
  constraints,
  control,
  index,
}: TypeFieldInputProps) => {
  const [isEditted, setIsEditted] = useState(false);

  const placeholder = constraints.length
    ? `Ability : ${constraints
        .map((constraint) => capitalize(constraint))
        .join(" + ")}`
    : "No ability";

  const {
    field: { onChange, value, ...fieldProps },
    fieldState: { error, isTouched },
  } = useController({
    control,
    name: `${index}`,
    rules: {
      required: true,
    },
  });
  const isError = (isTouched || isEditted) && !!error;

  return (
    <FormControl isInvalid={isError} {...fieldProps}>
      <Flex
        alignItems="center"
        gap={2}
        p="8px 16px"
        bgColor="gray.900"
        borderRadius="8px"
      >
        <Text variant="body1" w={7} fontWeight={700}>
          {`T${index}:`}
        </Text>
        <Input
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            setIsEditted(true);
            onChange(newValue);
          }}
          placeholder={placeholder}
        />
      </Flex>
    </FormControl>
  );
};
