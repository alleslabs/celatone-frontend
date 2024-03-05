import { Flex, FormControl, Input, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import { useState } from "react";
import { useController } from "react-hook-form";
import type { Control } from "react-hook-form";

import type { AbiFormData } from "lib/types";

interface TypeFieldInputProps {
  index: number;
  constraints: string[];
  control: Control<AbiFormData["typeArgs"]>;
}

export const TypeFieldInput = ({
  index,
  constraints,
  control,
}: TypeFieldInputProps) => {
  const [isEditted, setIsEditted] = useState(false);

  const placeholder = constraints.length
    ? `Ability : ${constraints
        .map((constraint) => capitalize(constraint))
        .join(" + ")}`
    : "No ability";

  const {
    field: { value, onChange, ...fieldProps },
    fieldState: { isTouched, error },
  } = useController({
    name: `${index}`,
    control,
    rules: {
      required: true,
    },
  });
  const isError = (isTouched || isEditted) && !!error;

  return (
    <FormControl isInvalid={isError} {...fieldProps}>
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
            setIsEditted(true);
            onChange(newValue);
          }}
        />
      </Flex>
    </FormControl>
  );
};
