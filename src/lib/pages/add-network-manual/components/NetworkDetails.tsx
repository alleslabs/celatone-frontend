import { Flex, Text } from "@chakra-ui/react";
import type { Control, FieldErrors } from "react-hook-form";

import type { AddNetworkManualForm } from "../types";
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
  return (
    <Flex direction="column" gap={2} alignItems="center">
      <CustomNetworkPageHeader title="Add Network Details" />
      <Flex w="full" direction="column" gap={6} mt={8}>
        <CustomNetworkSubheader
          title="Network Details"
          subtitle="Enter the Minitia’s general information and gather data touch points"
        />
        <ControllerInput
          name="networkName"
          control={control}
          label="Minitia Name"
          variant="fixed-floating"
          w="full"
          placeholder="ex. Jennie"
          rules={{
            required: "",
          }}
          error={errors.networkName?.message}
        />
        <ControllerInput
          name="lcdUrl"
          control={control}
          label="Minitia LCD URL"
          variant="fixed-floating"
          w="full"
          placeholder="https://"
          rules={{
            required: "",
          }}
          error={errors.lcdUrl?.message}
        />
        <ControllerInput
          name="rpcUrl"
          control={control}
          label="Minitia RPC URL"
          variant="fixed-floating"
          w="full"
          placeholder="https://"
          rules={{
            required: "",
          }}
          error={errors.rpcUrl?.message}
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