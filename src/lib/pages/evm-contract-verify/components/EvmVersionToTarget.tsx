import type { EvmVerifyConfig } from "lib/types";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { SelectInput } from "lib/components/forms";
import { EvmProgrammingLanguage } from "lib/types";
import { useMemo } from "react";
import { useController, useWatch } from "react-hook-form";

import { formatEvmOptions } from "../helpers";

interface EvmVersionToTargetProps<T extends FieldValues> {
  control: Control<T>;
  evmVerifyConfig: EvmVerifyConfig;
  name: FieldPath<T>;
}

export const EvmVersionToTarget = <T extends FieldValues>({
  control,
  evmVerifyConfig,
  name,
}: EvmVersionToTargetProps<T>) => {
  const {
    field: { onChange },
  } = useController({
    control,
    name,
  });
  const [evmVersion, language] = useWatch({
    control,
    name: [name, "language"] as FieldPath<T>[],
  });

  const evmVersionOptions = useMemo(
    () =>
      language === EvmProgrammingLanguage.Solidity
        ? formatEvmOptions(evmVerifyConfig.solidityEvmVersions)
        : formatEvmOptions(evmVerifyConfig.vyperEvmVersions),
    [language, evmVerifyConfig]
  );

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          EVM version to target
        </Heading>
        <Text color="text.dark" variant="body2">
          The Ethereum Virtual Machine version that the smart contract is
          designed and optimized to run on
        </Text>
      </Stack>
      <Grid templateColumns="repeat(2, 1fr)">
        <SelectInput
          isRequired
          label="EVM version to target"
          menuPortalTarget={
            typeof window !== "undefined" ? document.body : undefined
          }
          options={evmVersionOptions}
          value={evmVersionOptions.find(
            (option) => option.value === evmVersion
          )}
          onChange={(selectedOption) => {
            if (!selectedOption) return;
            onChange(selectedOption.value);
          }}
        />
      </Grid>
    </Stack>
  );
};
