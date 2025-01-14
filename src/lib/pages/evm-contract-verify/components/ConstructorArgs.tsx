import { Checkbox, Heading, Stack, Text, Textarea } from "@chakra-ui/react";
import { Control, useController, useWatch } from "react-hook-form";
import { EvmContractVerifyForm, VerificationOptions } from "../types";

interface ConstructorArgsProps {
  control: Control<EvmContractVerifyForm>;
}

export const ConstructorArgs = ({ control }: ConstructorArgsProps) => {
  const { field } = useController({
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
        isChecked={field.value !== undefined}
        onChange={(e) => field.onChange(e.target.checked ? "" : undefined)}
      >
        <Text>Have constructor arguments</Text>
      </Checkbox>
      <Textarea
        visibility={field.value === undefined ? "hidden" : "visible"}
        placeholder="ex.000000000000000000000000c005dc82818d67af737725bd4bf75435d065d239"
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
      />
    </Stack>
  );
};
