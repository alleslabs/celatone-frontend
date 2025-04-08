import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
import type { Control } from "react-hook-form";

import { Heading, Stack } from "@chakra-ui/react";
import { ControllerTextarea } from "lib/components/forms";
import { EvmVerifyOptions } from "lib/types";
import { useController } from "react-hook-form";

import { ConstructorArgs } from "../ConstructorArgs";
import { ContractLibraries } from "../ContractLibraries";
import { EvmContractVerifyAlert } from "../EvmContractVerifyAlert";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import { OptimizerConfiguration } from "../OptimizerConfiguration";

interface EvmContractVerifySolidityContractCodeProps {
  control: Control<EvmContractVerifyForm>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmContractVerifySolidityContractCode = ({
  control,
  evmVerifyConfig,
}: EvmContractVerifySolidityContractCodeProps) => {
  const {
    fieldState: { error },
  } = useController({
    control,
    name: "verifyForm.solidityContractCode.contractCode",
  });

  return (
    <Stack spacing={12}>
      <EvmContractVerifyAlert option={EvmVerifyOptions.SolidityContractCode} />
      <Stack spacing={6}>
        <Heading as="h6" variant="h6">
          Provide Contract Code
        </Heading>
        <ControllerTextarea
          label="Contract code"
          placeholder="Provide contract source code here"
          name="verifyForm.solidityContractCode.contractCode"
          isRequired
          control={control}
          error={error?.message}
          height="400px"
          isRequired
          label="Contract Code"
          name="verifyForm.solidityContractCode.contractCode"
          placeholder="Provide contract source code here"
          variant="fixed-floating"
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        evmVerifyConfig={evmVerifyConfig}
        name="verifyForm.solidityContractCode.evmVersion"
      />
      <OptimizerConfiguration<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode.optimizerConfig"
      />
      <ContractLibraries<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode.contractLibraries"
      />
    </Stack>
  );
};
