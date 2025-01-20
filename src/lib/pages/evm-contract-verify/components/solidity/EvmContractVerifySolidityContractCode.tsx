import { Control, useController } from "react-hook-form";
import { EvmContractVerifyForm } from "../../types";
import { Heading, Stack } from "@chakra-ui/react";
import { ControllerTextarea } from "lib/components/forms";
import { ConstructorArgs } from "../ConstructorArgs";
import { EvmVersionToTarget } from "../EvmVersionToTarget";
import { OptimizerConfiguration } from "../OptimizerConfiguration";

interface EvmContractVerifySolidityContractCodeProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifySolidityContractCode = ({
  control,
}: EvmContractVerifySolidityContractCodeProps) => {
  const {
    fieldState: { error },
  } = useController({
    control,
    name: "verifyForm.solidityContractCode.contractCode",
  });

  return (
    <Stack spacing={12}>
      <Stack spacing={6}>
        <Heading as="h6" variant="h6">
          Provide Contract Code
        </Heading>
        <ControllerTextarea
          label="Contract Code"
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
        name="verifyForm.solidityContractCode"
      />
      <EvmVersionToTarget<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode"
      />
      <OptimizerConfiguration<EvmContractVerifyForm>
        control={control}
        name="verifyForm.solidityContractCode"
      />
    </Stack>
  );
};
