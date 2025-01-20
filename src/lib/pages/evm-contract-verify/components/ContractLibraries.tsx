import { Button, Checkbox, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { useExampleAddresses } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { truncate } from "lib/utils";
import {
  ArrayPath,
  Control,
  FieldArray,
  FieldPath,
  FieldValues,
  useController,
  useFieldArray,
  useWatch,
} from "react-hook-form";

interface ContractLibrariesProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ContractLibraries = <T extends FieldValues>({
  control,
  name,
}: ContractLibrariesProps<T>) => {
  const { evmContract: exampleContractAddress } = useExampleAddresses();

  const { field } = useController({
    control,
    name: `${name}.contractLibraries` as FieldPath<T>,
  });

  const contractLibraries = useWatch({
    control,
    name: `${name}.contractLibraries` as FieldPath<T>,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.contractLibraries.value` as ArrayPath<T>,
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
        isChecked={contractLibraries.enabled}
        onChange={(e) =>
          field.onChange({ ...field.value, enabled: e.target.checked })
        }
      >
        <Text>Have contract libraries</Text>
      </Checkbox>
      <Stack
        gap={4}
        py={4}
        px={3}
        bgColor="gray.900"
        borderRadius="md"
        display={contractLibraries.enabled ? "flex" : "none"}
      >
        {fields.map((item, index) => (
          <Grid key={item.id} gridTemplateColumns="1fr 2fr auto" gap={4}>
            <ControllerInput
              label="Library Name"
              isRequired
              rules={{
                required: "",
              }}
              placeholder="ex. simple_math"
              name={`${item}.name` as FieldPath<T>}
              control={control}
              variant="fixed-floating"
            />
            <ControllerInput
              label="Contract Library Address"
              isRequired
              rules={{
                required: "",
              }}
              placeholder={`ex. ${truncate(exampleContractAddress)}`}
              name={`${item}.address` as FieldPath<T>}
              control={control}
              variant="fixed-floating"
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
          onClick={() =>
            append({ name: "", address: "" } as FieldArray<T, ArrayPath<T>>)
          }
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
