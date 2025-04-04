import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { useExampleAddresses } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { bech32AddressToHex, truncate } from "lib/utils";

interface ContractLibraryProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const ContractLibrary = <T extends FieldValues>({
  control,
  name,
}: ContractLibraryProps<T>) => {
  const { user: exampleBechAddress } = useExampleAddresses();
  const { field } = useController({
    control,
    name,
  });

  return (
    <>
      <ControllerInput
        label="Library name"
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
        label="Contract library address"
        rules={{
          required: "",
        }}
        placeholder={`ex. ${truncate(bech32AddressToHex(exampleBechAddress))}`}
        name={`${name}.address` as FieldPath<T>}
        control={control}
        variant="fixed-floating"
        labelBgColor="gray.900"
        error={field.value.address !== "" ? "" : "Required"}
      />
    </>
  );
};
