import { Box, Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useController, useWatch } from "react-hook-form";
import { ControllerTextarea } from "lib/components/forms";

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
        <Text variant="body2" color="text.dark">
          Provide ABI that will become the config of the contract
        </Text>
      </Stack>
      <Checkbox
        p={2}
        isChecked={field.value}
        onChange={(e) => field.onChange(e.target.checked)}
      >
        <Text>Have constructor arguments</Text>
      </Checkbox>
      <Box
        py={4}
        px={3}
        bgColor="gray.900"
        borderRadius="md"
        display={field.value ? "block" : "none"}
      >
        <ControllerTextarea
          backgroundColor="gray.900"
          name={`${name}.value` as FieldPath<T>}
          control={control}
          isRequired
          label="Constructor Arguments"
          placeholder="ex.000000000000000000000000c005dc82818d67af737725bd4bf75435d065d239"
          variant="fixed-floating"
          labelBgColor="gray.900"
          error={
            constructorArgsValue === ""
              ? "Invalid constructor arguments"
              : undefined
          }
        />
      </Box>
    </Stack>
  );
};
