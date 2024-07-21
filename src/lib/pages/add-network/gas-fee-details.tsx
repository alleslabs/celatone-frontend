import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ControllerInput } from "lib/components/forms";

import { AddNetworkHeader } from "./components/AddNetworkHeader";
import { AddNetworkSubheader } from "./components/AddNetworkSubheader";

export enum GasPriceConfiguration {
  STANDARD = "standard",
  CUSTOM = "custom",
}

const schema = z.object({
  gasAdjustment: z.string(),
  maxGasLimit: z.string(),
  feeTokenDenom: z.string(),
  gasPrice: z.string().optional(),
  fixedMinimumGasPrice: z.string().optional(),
  lowGasPrice: z.string().optional(),
  averageGasPrice: z.string().optional(),
  highGasPrice: z.string().optional(),
  gasForCosmosSend: z.string().optional(),
  gasForIBC: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const GasOptionRender = ({
  gasConfigs,
  control,
  errors,
}: {
  gasConfigs: GasPriceConfiguration;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
}) => (
  <>
    {gasConfigs === GasPriceConfiguration.STANDARD && (
      <ControllerInput
        name="gasPrice"
        control={control}
        label="Gas Price"
        variant="fixed-floating"
        w="full"
        placeholder="0.00"
        error={errors.gasPrice?.message}
      />
    )}
    {gasConfigs === GasPriceConfiguration.CUSTOM && (
      <>
        <ControllerInput
          name="fixedMinimumGasPrice"
          control={control}
          label="Fixed Minimum Gas Price"
          variant="fixed-floating"
          w="full"
          placeholder="0.00"
          rules={{ required: "" }}
          error={errors.fixedMinimumGasPrice?.message}
        />
        <ControllerInput
          name="lowGasPrice"
          control={control}
          label="Low Gas Price"
          variant="fixed-floating"
          w="full"
          placeholder="0.00"
          rules={{ required: "" }}
          error={errors.lowGasPrice?.message}
        />
        <ControllerInput
          name="averageGasPrice"
          control={control}
          label="Average Gas Price"
          variant="fixed-floating"
          w="full"
          placeholder="0.00"
          rules={{ required: "" }}
          error={errors.averageGasPrice?.message}
        />
        <ControllerInput
          name="highGasPrice"
          control={control}
          label="High Gas Price"
          variant="fixed-floating"
          w="full"
          placeholder="0.00"
          rules={{ required: "" }}
          error={errors.highGasPrice?.message}
        />
      </>
    )}
  </>
);

const GasFeeDetails = () => {
  const [gasConfigs, setGasConfigs] = useState<GasPriceConfiguration>(
    GasPriceConfiguration.STANDARD
  );

  const {
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      gasAdjustment: "",
      maxGasLimit: "",
      feeTokenDenom: "",
      gasPrice: "",
      fixedMinimumGasPrice: "",
      lowGasPrice: "",
      averageGasPrice: "",
      highGasPrice: "",
      gasForCosmosSend: "",
      gasForIBC: "",
    },
  });

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <AddNetworkHeader title="Add Gas & Fee Details" />
      <Flex w="full" direction="column" gap={8} mt={8}>
        <Flex direction="column" gap={6}>
          <AddNetworkSubheader title="Gas & Fee Details" />
          <Flex gap={6}>
            <ControllerInput
              name="gasAdjustment"
              control={control}
              label="Gas Adjustment"
              variant="fixed-floating"
              w="full"
              placeholder="0.00"
              rules={{ required: "" }}
              error={errors.gasAdjustment?.message}
            />
            <ControllerInput
              name="maxGasLimit"
              control={control}
              label="Max Gas Limit"
              variant="fixed-floating"
              w="full"
              placeholder="0.00"
              rules={{ required: "" }}
              error={errors.maxGasLimit?.message}
            />
          </Flex>
          <ControllerInput
            name="feeTokenDenom"
            control={control}
            label="Fee Tokens Denom"
            variant="fixed-floating"
            w="full"
            placeholder="ex. INIT"
            rules={{ required: "" }}
            error={errors.feeTokenDenom?.message}
          />
        </Flex>
        <Flex direction="column" gap={6}>
          <AddNetworkSubheader title="Gas Price Configuration" />
          <RadioGroup
            onChange={(nextVal) =>
              setGasConfigs(nextVal as GasPriceConfiguration)
            }
            value={gasConfigs}
          >
            <Flex gap={6} maxW={640}>
              <Flex>
                <Radio
                  variant="gray-card"
                  width="fit-content"
                  value={GasPriceConfiguration.STANDARD}
                >
                  Standard Gas Price
                  <Text variant="body3">
                    Set the standard gas price as the default for all gas price
                    configurations
                  </Text>
                </Radio>
              </Flex>
              <Flex>
                <Radio
                  variant="gray-card"
                  width="fit-content"
                  value={GasPriceConfiguration.CUSTOM}
                >
                  Custom Gas Prices
                  <Text variant="body3">
                    Set the custom value for minimum, low, average, and high gas
                    price
                  </Text>
                </Radio>
              </Flex>
            </Flex>
          </RadioGroup>
          <GasOptionRender
            gasConfigs={gasConfigs}
            control={control}
            errors={errors}
          />
        </Flex>
        <Accordion allowToggle w="full">
          <AccordionItem>
            <AccordionButton p={4}>
              <Text>Advanced Options</Text>
              <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
            </AccordionButton>
            <AccordionPanel pt={0} pb={4}>
              <Flex gap={6} mt={2}>
                <ControllerInput
                  labelBgColor="gray.900"
                  name="gasForCosmosSend"
                  control={control}
                  label="Gas Cost for Cosmos Send"
                  variant="fixed-floating"
                  w="full"
                  placeholder="0.00"
                  error={errors.gasForCosmosSend?.message}
                />
                <ControllerInput
                  labelBgColor="gray.900"
                  name="gasForIBC"
                  control={control}
                  label="Gas Cost for IBC"
                  variant="fixed-floating"
                  w="full"
                  placeholder="0.00"
                  error={errors.gasForIBC?.message}
                />
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Flex>
  );
};

export default GasFeeDetails;
