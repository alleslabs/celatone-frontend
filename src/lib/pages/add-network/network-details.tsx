import { Flex, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ControllerInput } from "lib/components/forms";

import { AddNetworkHeader } from "./components/AddNetworkHeader";
import { AddNetworkSubheader } from "./components/AddNetworkSubheader";

const URL_REGEX =
  /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/;
const NetworkDetails = () => {
  const {
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        networkName: z.string(),
        lcdUrl: z.string().regex(URL_REGEX, "Please enter a valid LCD URL"),
        rpcUrl: z.string().regex(URL_REGEX, "Please enter a valid RPC URL"),
        chainId: z
          .string()
          .regex(/^[a-z-]+$/, "Enter alphabet (a-z) and dash (-) only"),
        registryChainName: z
          .string()
          .regex(/^[a-z]+$/, "Enter alphabet (a-z) with no spaces"),
        logoUri: z.string().regex(URL_REGEX, "Please enter a valid URL"),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      networkName: "",
      lcdUrl: "",
      rpcUrl: "",
      chainId: "",
      registryChainName: "",
      logoUri: "",
    },
  });

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <AddNetworkHeader title="Add Network Details" />
      <Flex w="full" direction="column" gap={6} mt={8}>
        <AddNetworkSubheader
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
            helperText="Enter alphabet (a-z) and dash (-) only"
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
            helperText="Enter alphabet (a-z) with no spaces"
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
          rules={{
            required: "",
          }}
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

export default NetworkDetails;
