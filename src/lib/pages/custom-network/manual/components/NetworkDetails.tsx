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
  const vm = useWatch({
    control,
    name: "vm",
  });

  const { field: vmTypeField } = useController({
    control,
    name: "vm.type",
  });

  return (
    <Flex alignItems="center" gap={2} direction="column">
      <CustomNetworkPageHeader title="Add Network Details" />
      <Flex gap={6} mt={8} w="full" direction="column">
        <CustomNetworkSubheader
          subtitle="Choose supported VM for the custom Minitia"
          title="VM Type"
        />
        <RadioGroup
          value={vm.type}
          onChange={(nextVal) => vmTypeField.onChange(nextVal)}
        >
          <Grid
            gridTemplateColumns="repeat(3, 1fr)"
            gap={4}
            height={16}
            maxW={640}
          >
            <Radio
              width="fit-content"
              value={VmType.MOVE}
              variant="gray-card"
              w="full"
              overflow="hidden"
            >
              Move
            </Radio>
            <Radio
              width="fit-content"
              value={VmType.WASM}
              variant="gray-card"
              w="full"
              overflow="hidden"
            >
              Wasm
            </Radio>
            <Radio
              width="fit-content"
              value={VmType.EVM}
              variant="gray-card"
              w="full"
              overflow="hidden"
            >
              EVM
            </Radio>
          </Grid>
        </RadioGroup>
        {vm.type === VmType.EVM && (
          <ControllerInput
            label="JSON RPC"
            name="vm.jsonRpc"
            rules={{
              required: "",
            }}
            variant="fixed-floating"
            w="full"
            control={control}
            error={
              (errors.vm as { jsonRpc?: { message: string } })?.jsonRpc?.message
            }
            placeholder="https://"
          />
        )}
      </Flex>
      <Flex gap={6} mt={8} w="full" direction="column">
        <CustomNetworkSubheader
          subtitle="Enter the Minitia’s general information and gather data touch points"
          title="Network Details"
        />
        <ControllerInput
          label="Minitia Name"
          name="prettyName"
          rules={{
            required: "",
          }}
          variant="fixed-floating"
          w="full"
          control={control}
          error={errors.prettyName?.message}
          placeholder="ex. Jennie"
        />
        <ControllerInput
          label="Minitia LCD URL"
          name="lcd"
          rules={{
            required: "",
          }}
          variant="fixed-floating"
          w="full"
          control={control}
          error={errors.lcd?.message}
          placeholder="https://"
        />
        <ControllerInput
          label="Minitia RPC URL"
          name="rpc"
          rules={{
            required: "",
          }}
          variant="fixed-floating"
          w="full"
          control={control}
          error={errors.rpc?.message}
          placeholder="https://"
        />
        <Flex gap={6}>
          <ControllerInput
            label="Minitia Chain ID"
            name="chainId"
            rules={{
              required: "",
            }}
            variant="fixed-floating"
            w="full"
            control={control}
            error={errors.chainId?.message}
            placeholder="ex. jennie-init-1"
          />
          <ControllerInput
            helperText={
              errors.registryChainName?.message
                ? ""
                : "Lower case letter (a-z) or number (0-9)"
            }
            label="Registry Chain Name"
            name="registryChainName"
            rules={{
              required: "",
            }}
            variant="fixed-floating"
            w="full"
            control={control}
            error={errors.registryChainName?.message}
            placeholder="ex. jennieinit"
          />
        </Flex>
        <ControllerInput
          helperText="1:1 ratio image is recommended"
          label="Logo URI"
          name="logoUri"
          variant="fixed-floating"
          w="full"
          control={control}
          error={errors.logoUri?.message}
          placeholder="https://"
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
