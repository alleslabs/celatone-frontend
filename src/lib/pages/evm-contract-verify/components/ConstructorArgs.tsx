import { Box, Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
  useWatch,
} from "react-hook-form";
import { ControllerTextarea } from "lib/components/forms";

interface ConstructorArgsProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ConstructorArgs = <T extends FieldValues>({
  control,
  name,
}: ConstructorArgsProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const constructorArgs = useWatch({
    control,
    name,
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
        isChecked={constructorArgs.enabled}
        onChange={(e) =>
          field.onChange({ ...field.value, enabled: e.target.checked })
        }
      >
        <Text>Have constructor arguments</Text>
      </Checkbox>
      <Box
        py={4}
        px={3}
        bgColor="gray.900"
        borderRadius="md"
        display={constructorArgs.enabled ? "block" : "none"}
      >
        <ControllerTextarea
          backgroundColor="gray.900"
          name={`${name}.constructorArgs.value` as FieldPath<T>}
          control={control}
          isRequired
          label="Constructor Arguments"
          placeholder="ex.000000000000000000000000c005dc82818d67af737725bd4bf75435d065d239"
          variant="fixed-floating"
          labelBgColor="gray.900"
          error={error?.message}
        />
      </Box>
    </Stack>
  );
};
