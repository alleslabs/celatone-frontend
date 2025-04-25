import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
import type { Control } from "react-hook-form";

import { Heading, Stack } from "@chakra-ui/react";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { EvmVerifyOptions } from "lib/types";
import { useController } from "react-hook-form";

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
          Provide contract code
        </Heading>
        <ControllerInput
          control={control}
          error={contractNameError?.message}
          isRequired
          label="Contract name"
          name="verifyForm.vyperContractCode.contractName"
          placeholder="Provide contract name"
          variant="fixed-floating"
        />
        <ControllerTextarea
          control={control}
          error={contractCodeError?.message}
          height="400px"
          isRequired
          label="Contract code"
          name="verifyForm.vyperContractCode.contractCode"
          placeholder="Provide contract source code here"
          variant="fixed-floating"
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.vyperContractCode.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        evmVerifyConfig={evmVerifyConfig}
        name="verifyForm.vyperContractCode.evmVersion"
      />
    </Stack>
  );
};
