import { Heading, Stack } from "@chakra-ui/react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { EvmVerifyOptions } from "lib/types";
import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmContractVerifyAlert } from "../EvmContractVerifyAlert";
import { EvmVersionToTarget } from "../EvmVersionToTarget";

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
      <EvmContractVerifyAlert option={EvmVerifyOptions.VyperContractCode} />
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
        name="verifyForm.vyperContractCode.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperContractCode.evmVersion"
        evmVerifyConfig={evmVerifyConfig}
      />
    </Stack>
  );
};
