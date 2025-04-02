import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Box, Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import { ControllerTextarea } from "lib/components/forms";
import { useController, useWatch } from "react-hook-form";

interface ConstructorArgsProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ConstructorArgs = <T extends FieldValues>({
  control,
  name,
}: ConstructorArgsProps<T>) => {
  const { field } = useController({
    control,
    name: `${name}.enabled` as FieldPath<T>,
  });

  const constructorArgsValue = useWatch({
    control,
    name: `${name}.value` as FieldPath<T>,
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Input Constructor Arguments
        </Heading>
        <Text color="text.dark" variant="body2">
          Provide ABI that will become the config of the contract
        </Text>
      </Stack>
      <Checkbox
        isChecked={field.value}
        p={2}
        onChange={(e) => field.onChange(e.target.checked)}
      >
        <Text>Have constructor arguments</Text>
      </Checkbox>
      <Box
        bgColor="gray.900"
        borderRadius="md"
        display={field.value ? "block" : "none"}
        px={3}
        py={4}
      >
        <ControllerTextarea
          backgroundColor="gray.900"
          control={control}
          error={
            constructorArgsValue === ""
              ? "Invalid constructor arguments"
              : undefined
          }
          isRequired
          label="Constructor Arguments"
          labelBgColor="gray.900"
          name={`${name}.value` as FieldPath<T>}
          placeholder="ex.000000000000000000000000c005dc82818d67af737725bd4bf75435d065d239"
          variant="fixed-floating"
        />
      </Box>
    </Stack>
  );
};
