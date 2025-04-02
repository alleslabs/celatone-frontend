import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { useExampleAddresses } from "lib/app-provider";
import { ControllerInput } from "lib/components/forms";
import { bech32AddressToHex, truncate } from "lib/utils";
import { useController } from "react-hook-form";

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
        control={control}
        error={field.value.name !== "" ? "" : "Required"}
        label="Library Name"
        labelBgColor="gray.900"
        name={`${name}.name` as FieldPath<T>}
        placeholder="ex. simple_math"
        rules={{
          required: "",
        }}
        variant="fixed-floating"
      />
      <ControllerInput
        control={control}
        error={field.value.address !== "" ? "" : "Required"}
        label="Contract Library Address"
        labelBgColor="gray.900"
        name={`${name}.address` as FieldPath<T>}
        placeholder={`ex. ${truncate(bech32AddressToHex(exampleBechAddress))}`}
        rules={{
          required: "",
        }}
        variant="fixed-floating"
      />
    </>
  );
};
