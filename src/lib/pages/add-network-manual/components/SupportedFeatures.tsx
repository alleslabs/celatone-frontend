import {
  Checkbox,
  CheckboxGroup,
  Flex,
  FormLabel,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useController, useWatch } from "react-hook-form";
import type { Control, FieldPath } from "react-hook-form";

import type { AddNetworkManualForm, SupportedFeaturesForm } from "../types";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";

const initialFeatures: {
  label: string;
  name: FieldPath<SupportedFeaturesForm>;
}[] = [
  { label: "Wasm", name: "isWasm" },
  { label: "Move", name: "isMove" },
  { label: "NFTs", name: "isNfts" },
];

interface SupportedFeaturesCheckboxProps {
  label: string;
  name: FieldPath<AddNetworkManualForm>;
  control: Control<AddNetworkManualForm>;
}

const SupportedFeaturesCheckbox = ({
  label,
  name,
  control,
}: SupportedFeaturesCheckboxProps) => {
  const isChecked = useWatch({
    name,
    control,
  });

  const { field } = useController({
    name,
    control,
  });

  return (
    <FormLabel
      key={label}
      display="flex"
      alignItems="center"
      p={4}
      mb={2}
      bg="gray.900"
      borderRadius={8}
      border="1px solid"
      borderColor={isChecked ? "gray.400" : "transparent"}
      cursor="pointer"
      transition="all 0.25s ease-in-out"
      _hover={{
        background: "gray.800",
      }}
      htmlFor={name}
    >
      <Checkbox
        id={name}
        isChecked={!!isChecked}
        size="lg"
        mr={4}
        variant="white"
        onChange={(e) => field.onChange(e.target.checked)}
      />
      <Text color="white" fontSize="md">
        {label}
      </Text>
    </FormLabel>
  );
};

interface SupportedFeaturesProps {
  control: Control<AddNetworkManualForm>;
}

export const SupportedFeatures = ({ control }: SupportedFeaturesProps) => (
  <Flex direction="column" gap={2} alignItems="center">
    <CustomNetworkPageHeader title="Select Supported Features" />
    <Flex w="full" direction="column" gap={6} my={8}>
      <CustomNetworkSubheader
        title="Feature Lists"
        subtitle="Choose supported features for your custom Minitia. This can be changed later."
      />
      <CheckboxGroup>
        <Stack gap={4}>
          {initialFeatures.map(({ label, name }) => (
            <SupportedFeaturesCheckbox
              label={label}
              name={name}
              control={control}
            />
          ))}
        </Stack>
      </CheckboxGroup>
    </Flex>
  </Flex>
);
