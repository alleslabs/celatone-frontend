import { Control, useController } from "react-hook-form";
import { Heading, Stack } from "@chakra-ui/react";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { EvmContractVerifyForm, EvmVerifyConfig } from "lib/services/types";

interface EvmContractVerifyVyperContractCodeProps {
  control: Control<EvmContractVerifyForm>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifyVyperContractCode = ({
  control,
  evmVerifyConfig,
}: EvmContractVerifyVyperContractCodeProps) => {
  const {
    fieldState: { error: contractNameError },
  } = useController({
    control,
    name: "verifyForm.vyperContractCode.contractName",
  });

  const {
    fieldState: { error: contractCodeError },
  } = useController({
    control,
    name: "verifyForm.vyperContractCode.contractCode",
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
          name="verifyForm.vyperContractCode.contractName"
          isRequired
          control={control}
          variant="fixed-floating"
          error={contractNameError?.message}
        />
        <ControllerTextarea
          label="Contract Code"
          placeholder="Provide contract source code here"
          name="verifyForm.vyperContractCode.contractCode"
          isRequired
          control={control}
          variant="fixed-floating"
          error={contractCodeError?.message}
          height="400px"
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperContractCode"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperContractCode"
        evmVerifyConfig={evmVerifyConfig}
      />
    </Stack>
  );
};
