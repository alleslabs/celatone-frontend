import { Control, useController } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";
import { Heading, Stack } from "@chakra-ui/react";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";

interface EvmContractVerifyVyperContractCodeProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyVyperContractCode = ({
  control,
}: EvmContractVerifyVyperContractCodeProps) => {
  const {
    fieldState: { error: contractNameError },
  } = useController({
    control,
    name: "verifyForm.form.contractName",
  });

  const {
    fieldState: { error: contractCodeError },
  } = useController({
    control,
    name: "verifyForm.form.contractCode",
  });

  return (
    <Stack spacing={12}>
      <Stack spacing={6}>
        <Heading as="h6" variant="h6">
          Provide Contract Code
        </Heading>
        <ControllerInput
          label="Contract Name"
          placeholder="Provide contract name"
          name="verifyForm.form.contractName"
          isRequired
          control={control}
          variant="fixed-floating"
          error={contractNameError?.message}
        />
        <ControllerTextarea
          label="Contract Code"
          placeholder="Provide contract source code here"
          name="verifyForm.form.contractCode"
          isRequired
          control={control}
          variant="fixed-floating"
          error={contractCodeError?.message}
          height="400px"
        />
      </Stack>
      <ConstructorArgs control={control} />
      <EvmVersionToTarget control={control} />
    </Stack>
  );
};
