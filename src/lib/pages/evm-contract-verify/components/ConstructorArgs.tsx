import { Box, Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import { EvmContractVerifyForm } from "../types";
import { ControllerTextarea } from "lib/components/forms";

interface ConstructorArgsProps {
  control: Control<EvmContractVerifyForm>;
}

export const ConstructorArgs = ({ control }: ConstructorArgsProps) => {
  const { field: fieldEnabled } = useController({
    control,
    name: "verifyForm.form.constructorArgs.enabled",
  });

  const {
    fieldState: { error },
  } = useController({
    control,
    name: "verifyForm.form.constructorArgs.value",
  });

  const constructorArgs = useWatch({
    control,
    name: "verifyForm.form.constructorArgs",
  });

  return (
    <Stack spacing={6}>
      <Stack spacing={1}>
        <Heading as="h6" variant="h6">
          Input Constructor Arguments
        </Heading>
        <Text variant="body2" color="text.dark">
          Provide ABI that will become the config of the contract
        </Text>
      </Stack>
      <Checkbox
        pl={3}
        isChecked={constructorArgs.enabled}
        onChange={(e) => fieldEnabled.onChange(e.target.checked)}
      >
        <Text>Have constructor arguments</Text>
      </Checkbox>
      <Box
        py={4}
        px={3}
        bgColor="gray.900"
        borderRadius="md"
        display={fieldEnabled.value ? "block" : "none"}
      >
        <ControllerTextarea
          backgroundColor="gray.900"
          name="verifyForm.form.constructorArgs.value"
          control={control}
          isRequired
          label="Constructor Arguments"
          placeholder="ex.000000000000000000000000c005dc82818d67af737725bd4bf75435d065d239"
          variant="fixed-floating"
          labelBgColor="gray.900"
          error={error?.message}
        />
      </Box>
    </Stack>
  );
};
