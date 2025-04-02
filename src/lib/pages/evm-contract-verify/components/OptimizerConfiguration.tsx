import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Checkbox, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { ControllerInput } from "lib/components/forms";
import { useController, useWatch } from "react-hook-form";

interface OptimizerConfigurationProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
}

export const OptimizerConfiguration = <T extends FieldValues>({
  control,
  name,
}: OptimizerConfigurationProps<T>) => {
  const { field } = useController({
    control,
    name,
  });

  const { enabled, runs } = useWatch({
    control,
    name,
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Optimization Configuration
        </Heading>
        <Text color="text.dark" variant="body2">
          Provide optimization settings for the contract
        </Text>
      </Stack>
      <Flex alignItems="center" gap={4} pl={2}>
        <Checkbox
          isChecked={enabled}
          onChange={(e) =>
            field.onChange({ ...field.value, enabled: e.target.checked })
          }
        >
          <Text>Optimization Enabled</Text>
        </Checkbox>
        <Flex alignItems="center" gap={2}>
          <Text color="text.disabled">Optimization Run:</Text>
          <ControllerInput
            control={control}
            isDisabled={!enabled}
            name={`${name}.runs` as FieldPath<T>}
            size="md"
            status={
              enabled && runs === ""
                ? {
                    state: "error",
                  }
                : undefined
            }
            type="number"
            width={125}
          />
        </Flex>
      </Flex>
    </Stack>
  );
};
