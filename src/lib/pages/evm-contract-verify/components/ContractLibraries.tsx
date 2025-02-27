import { Button, Checkbox, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import type {
  Control,
  FieldArray,
  FieldArrayPath,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { useController, useFieldArray } from "react-hook-form";
import { CustomIcon } from "lib/components/icon";
import { ContractLibrary } from "./ContractLibrary";

interface ContractLibrariesProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ContractLibraries = <T extends FieldValues>({
  control,
  name,
}: ContractLibrariesProps<T>) => {
  const { field } = useController({
    control,
    name: `${name}.enabled` as FieldPath<T>,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.value` as FieldArrayPath<T>,
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Add Contract Libraries
        </Heading>
        <Text variant="body2" color="text.dark">
          Provide addresses of external libraries linked to the contract to
          ensure accurate verification
        </Text>
      </Stack>
      <Checkbox
        p={2}
        isChecked={field.value}
        onChange={(e) => field.onChange(e.target.checked)}
      >
        <Text>Have contract libraries</Text>
      </Checkbox>
      <Stack
        gap={4}
        py={4}
        px={3}
        bgColor="gray.900"
        borderRadius="md"
        display={field.value ? "flex" : "none"}
      >
        {fields.map(({ id }, index) => (
          <Grid key={id} gridTemplateColumns="1fr 2fr auto" gap={4}>
            <ContractLibrary<T>
              control={control}
              name={`${name}.value.${index}` as FieldPath<T>}
            />
            <Button
              variant="outline-gray"
              w={14}
              h={14}
              isDisabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <CustomIcon name="delete" />
            </Button>
          </Grid>
        ))}
        <Button
          onClick={() => append({ name: "", address: "" } as FieldArray<T>)}
          variant="ghost-primary"
          p="unset"
          size="md"
          w="fit-content"
          display="block"
        >
          <CustomIcon name="plus" boxSize={3} />
          Add library
        </Button>
      </Stack>
    </Stack>
  );
};
