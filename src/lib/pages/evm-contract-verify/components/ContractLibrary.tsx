import { useExampleAddresses } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { truncate } from "lib/utils";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";

interface ContractLibraryProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ContractLibrary = <T extends FieldValues>({
  control,
  name,
}: ContractLibraryProps<T>) => {
  const { evmContract: exampleContractAddress } = useExampleAddresses();
  const { field } = useController({
    control,
    name,
  });

  return (
    <>
      <ControllerInput
        label="Library Name"
        rules={{
          required: "",
        }}
        placeholder="ex. simple_math"
        name={`${name}.name` as FieldPath<T>}
        control={control}
        variant="fixed-floating"
        labelBgColor="gray.900"
        error={field.value.name !== "" ? "" : "Required"}
      />
      <ControllerInput
        label="Contract Library Address"
        rules={{
          required: "",
        }}
        placeholder={`ex. ${truncate(exampleContractAddress)}`}
        name={`${name}.address` as FieldPath<T>}
        control={control}
        variant="fixed-floating"
        labelBgColor="gray.900"
        error={field.value.address !== "" ? "" : "Required"}
      />
    </>
  );
};
