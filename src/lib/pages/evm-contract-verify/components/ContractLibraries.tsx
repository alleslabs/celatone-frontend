import type {
  Control,
  FieldArray,
  FieldArrayPath,
  FieldPath,
  FieldValues,
} from "react-hook-form";

import { Button, Checkbox, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { useController, useFieldArray } from "react-hook-form";

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

  const { append, fields, remove } = useFieldArray({
    control,
    name: `${name}.value` as FieldArrayPath<T>,
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Add Contract Libraries
        </Heading>
        <Text color="text.dark" variant="body2">
          Provide addresses of external libraries linked to the contract to
          ensure accurate verification
        </Text>
      </Stack>
      <Checkbox
        isChecked={field.value}
        p={2}
        onChange={(e) => field.onChange(e.target.checked)}
      >
        <Text>Have contract libraries</Text>
      </Checkbox>
      <Stack
        bgColor="gray.900"
        borderRadius="md"
        display={field.value ? "flex" : "none"}
        gap={4}
        px={3}
        py={4}
      >
        {fields.map(({ id }, index) => (
          <Grid key={id} gap={4} gridTemplateColumns="1fr 2fr auto">
            <ContractLibrary<T>
              control={control}
              name={`${name}.value.${index}` as FieldPath<T>}
            />
            <Button
              h={14}
              isDisabled={fields.length === 1}
              variant="outline-gray"
              w={14}
              onClick={() => remove(index)}
            >
              <CustomIcon name="delete" />
            </Button>
          </Grid>
        ))}
        <Button
          display="block"
          p="unset"
          size="md"
          variant="ghost-primary"
          w="fit-content"
          onClick={() => append({ address: "", name: "" } as FieldArray<T>)}
        >
          <CustomIcon boxSize={3} name="plus" />
          Add library
        </Button>
      </Stack>
    </Stack>
  );
};
