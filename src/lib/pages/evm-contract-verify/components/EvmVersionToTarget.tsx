import { Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { SelectInput } from "lib/components/forms";
import { EvmProgrammingLanguage, EvmVerifyConfig } from "lib/services/types";
import { useMemo } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
  useWatch,
} from "react-hook-form";
import { formatEvmOptions } from "../helpers";

interface EvmVersionToTargetProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  evmVerifyConfig: EvmVerifyConfig;
}

export const EvmVersionToTarget = <T extends FieldValues>({
  control,
  name,
  evmVerifyConfig,
}: EvmVersionToTargetProps<T>) => {
  const {
    field: { onChange },
  } = useController({
    control,
    name: `${name}.evmVersion` as FieldPath<T>,
  });
  const [evmVersion, language] = useWatch({
    control,
    name: [`${name}.evmVersion`, "language"] as FieldPath<T>[],
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
