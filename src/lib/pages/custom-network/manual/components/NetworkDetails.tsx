import { Flex, Grid, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { useController, useWatch } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

import { VmType } from "../../types";
import type { AddNetworkManualForm } from "../../types";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";

interface NetworkDetailsProps {
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
}

export const NetworkDetails = ({ control, errors }: NetworkDetailsProps) => {
  const vmType = useWatch({
    control,
    name: "vmType",
  });

  const { field: vmTypeField } = useController({
    control,
    name: "vmType",
  });

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <CustomNetworkPageHeader title="Add Network Details" />
      <Flex w="full" direction="column" gap={6} mt={8}>
        <CustomNetworkSubheader
          title="VM Type"
          subtitle="Choose supported VM for the custom Minitia"
        />
        <RadioGroup
          onChange={(nextVal) => vmTypeField.onChange(nextVal)}
          value={vmType}
        >
          <Grid gridTemplateColumns="repeat(2, 1fr)" gap={6} maxW={640}>
            <Radio
              variant="gray-card"
              width="fit-content"
              value={VmType.MOVE}
              w="full"
            >
              Move
            </Radio>
            <Radio
              variant="gray-card"
              width="fit-content"
              value={VmType.WASM}
              w="full"
            >
              Wasm
            </Radio>
          </Grid>
        </RadioGroup>
      </Flex>
      <Flex w="full" direction="column" gap={6} mt={8}>
        <CustomNetworkSubheader
          title="Network Details"
          subtitle="Enter the Minitia’s general information and gather data touch points"
        />
        <ControllerInput
          name="prettyName"
          control={control}
          label="Minitia Name"
          variant="fixed-floating"
          w="full"
          placeholder="ex. Jennie"
          rules={{
            required: "",
          }}
          error={errors.prettyName?.message}
        />
        <ControllerInput
          name="lcd"
          control={control}
          label="Minitia LCD URL"
          variant="fixed-floating"
          w="full"
          placeholder="https://"
          rules={{
            required: "",
          }}
          error={errors.lcd?.message}
        />
        <ControllerInput
          name="rpc"
          control={control}
          label="Minitia RPC URL"
          variant="fixed-floating"
          w="full"
          placeholder="https://"
          rules={{
            required: "",
          }}
          error={errors.rpc?.message}
        />
        <Flex gap={6}>
          <ControllerInput
            name="chainId"
            control={control}
            label="Minitia Chain ID"
            variant="fixed-floating"
            w="full"
            placeholder="ex. jennie-init-1"
            rules={{
              required: "",
            }}
            error={errors.chainId?.message}
          />
          <ControllerInput
            name="registryChainName"
            control={control}
            label="Registry Chain Name"
            variant="fixed-floating"
            w="full"
            placeholder="ex. jennieinit"
            helperText={
              errors.registryChainName?.message
                ? ""
                : "Lower case letter (a-z) or number (0-9)"
            }
            rules={{
              required: "",
            }}
            error={errors.registryChainName?.message}
          />
        </Flex>
        <ControllerInput
          name="logoUri"
          control={control}
          label="Logo URI"
          variant="fixed-floating"
          w="full"
          placeholder="https://"
          error={errors.logoUri?.message}
          helperText="1:1 ratio image is recommended"
        />
      </Flex>
      <Flex mt={8}>
        <Text variant="body2" color="text.dark">
          You can edit these details later.
        </Text>
      </Flex>
    </Flex>
  );
};
