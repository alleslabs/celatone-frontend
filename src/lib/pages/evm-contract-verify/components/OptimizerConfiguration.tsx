import { Checkbox, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import { EvmContractVerifyForm } from "../types";
import { ControllerInput } from "lib/components/forms";

interface OptimizerConfigurationProps {
  control: Control<EvmContractVerifyForm>;
}

export const OptimizerConfiguration = ({
  control,
}: OptimizerConfigurationProps) => {
  const { field } = useController({
    control,
    name: "verifyForm.form.optimizerConfig",
  });

  const enabled = useWatch({
    control,
    name: "verifyForm.form.optimizerConfig.enabled",
  });

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Optimization Configuration
        </Heading>
        <Text variant="body2" color="text.dark">
          Provide optimization settings for the contract
        </Text>
      </Stack>
      <HStack spacing={4} pl={3}>
        <Checkbox
          isChecked={enabled}
          onChange={(e) =>
            field.onChange({ ...field.value, enabled: e.target.checked })
          }
        >
          <Text>Optimization Enabled</Text>
        </Checkbox>
        <HStack spacing={2}>
          <Text color="text.disabled">Optimization Run:</Text>
          <ControllerInput
            width={125}
            type="number"
            name="verifyForm.form.optimizerConfig.runs"
            isDisabled={!enabled}
            control={control}
            size="sm"
          />
        </HStack>
      </HStack>
    </Stack>
  );
};
