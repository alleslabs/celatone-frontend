import { Heading, Stack } from "@chakra-ui/react";
import type { Control } from "react-hook-form";
import { useController } from "react-hook-form";
import { ControllerTextarea } from "lib/components/forms";
import { EvmVerifyOptions } from "lib/types";
import type { EvmContractVerifyForm, EvmVerifyConfig } from "lib/types";
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
          variant="fixed-floating"
          error={error?.message}
          height="400px"
        />
      </Stack>
      <ConstructorArgs<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode.constructorArgs"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode.evmVersion"
        evmVerifyConfig={evmVerifyConfig}
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
