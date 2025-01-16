import { Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { SelectInput } from "lib/components/forms";
import { useMemo } from "react";
import { Control, useController, useWatch } from "react-hook-form";
import { EvmContractVerifyForm } from "../types";

interface EvmVersionToTargetProps {
  control: Control<EvmContractVerifyForm>;
}

export const EvmVersionToTarget = ({ control }: EvmVersionToTargetProps) => {
  const {
    field: { onChange },
  } = useController({
    control,
    name: "verifyForm.form.evmVersion",
  });
  const evmVersion = useWatch({
    control,
    name: "verifyForm.form.evmVersion",
  });

  const evmVersionOptions = useMemo(
    () => [
      {
        label: "Default",
        value: "default",
      },
    ],
    []
  );

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          EVM Version to Target
        </Heading>
        <Text variant="body2" color="text.dark">
          The Ethereum Virtual Machine version that the smart contract is
          designed and optimized to run on
        </Text>
      </Stack>
      <Grid templateColumns="repeat(2, 1fr)">
        <SelectInput
          label="EVM Version to target"
          menuPortalTarget={document.body}
          isRequired
          options={evmVersionOptions}
          onChange={(selectedOption) => {
            if (!selectedOption) return;
            onChange(selectedOption.value);
          }}
          value={evmVersionOptions.find(
            (option) => option.value === evmVersion
          )}
        />
      </Grid>
    </Stack>
  );
};
