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
        label="Library name"
        rules={{
          required: "",
        }}
        variant="fixed-floating"
      />
      <ControllerInput
        label="Contract library address"
        rules={{
          required: "",
        }}
        variant="fixed-floating"
      />
    </>
  );
};
