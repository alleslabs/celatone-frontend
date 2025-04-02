import type { Control, FieldErrors } from "react-hook-form";

import { Flex, Grid, Radio, RadioGroup, Text } from "@chakra-ui/react";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";
import { useController, useWatch } from "react-hook-form";

import type { AddNetworkManualForm } from "../../types";

import { VmType } from "../../types";

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
    <Flex alignItems="center" direction="column" gap={2}>
      <CustomNetworkPageHeader title="Add Network Details" />
      <Flex direction="column" gap={6} mt={8} w="full">
        <CustomNetworkSubheader
          subtitle="Choose supported VM for the custom Rollup"
          title="VM Type"
        />
        <RadioGroup
          value={vm.type}
          onChange={(nextVal) => vmTypeField.onChange(nextVal)}
        >
          <Grid
            gap={4}
            gridTemplateColumns="repeat(3, 1fr)"
            height={16}
            maxW={640}
          >
            <Radio
              overflow="hidden"
              value={VmType.MOVE}
              variant="gray-card"
              w="full"
              width="fit-content"
            >
              Move
            </Radio>
            <Radio
              overflow="hidden"
              value={VmType.WASM}
              variant="gray-card"
              w="full"
              width="fit-content"
            >
              Wasm
            </Radio>
            <Radio
              overflow="hidden"
              value={VmType.EVM}
              variant="gray-card"
              w="full"
              width="fit-content"
            >
              EVM
            </Radio>
          </Grid>
        </RadioGroup>
        {vm.type === VmType.EVM && (
          <ControllerInput
            control={control}
            error={
              (errors.vm as { jsonRpc?: { message: string } })?.jsonRpc?.message
            }
            label="JSON RPC"
            name="vm.jsonRpc"
            placeholder="https://"
            rules={{
              required: "",
            }}
            variant="fixed-floating"
            w="full"
          />
        )}
      </Flex>
      <Flex direction="column" gap={6} mt={8} w="full">
        <CustomNetworkSubheader
          subtitle="Enter the Rollup’s general information and gather data touch points"
          title="Network Details"
        />
        <ControllerInput
          control={control}
          error={errors.prettyName?.message}
          label="Rollup Name"
          name="prettyName"
          placeholder="ex. Jennie"
          rules={{
            required: "",
          }}
          variant="fixed-floating"
          w="full"
        />
        <ControllerInput
          control={control}
          error={errors.rest?.message}
          label="Rollup REST URL"
          name="rest"
          placeholder="https://"
          rules={{
            required: "",
          }}
          variant="fixed-floating"
          w="full"
        />
        <ControllerInput
          control={control}
          error={errors.rpc?.message}
          label="Rollup RPC URL"
          name="rpc"
          placeholder="https://"
          rules={{
            required: "",
          }}
          variant="fixed-floating"
          w="full"
        />
        <Flex gap={6}>
          <ControllerInput
            control={control}
            error={errors.chainId?.message}
            label="Rollup Chain ID"
            name="chainId"
            placeholder="ex. jennie-init-1"
            rules={{
              required: "",
            }}
            variant="fixed-floating"
            w="full"
          />
          <ControllerInput
            control={control}
            error={errors.registryChainName?.message}
            helperText={
              errors.registryChainName?.message
                ? ""
                : "Lower case letter (a-z) or number (0-9)"
            }
            label="Registry Chain Name"
            name="registryChainName"
            placeholder="ex. jennieinit"
            rules={{
              required: "",
            }}
            variant="fixed-floating"
            w="full"
          />
        </Flex>
        <ControllerInput
          control={control}
          error={errors.logoUri?.message}
          helperText="1:1 ratio image is recommended"
          label="Logo URI"
          name="logoUri"
          placeholder="https://"
          variant="fixed-floating"
          w="full"
        />
      </Flex>
      <Flex mt={8}>
        <Text color="text.dark" variant="body2">
          You can edit these details later.
        </Text>
      </Flex>
    </Flex>
  );
};
