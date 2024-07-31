import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

import type { AddNetworkManualForm } from "../types";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";

export enum GasPriceConfiguration {
  STANDARD = "standard",
  CUSTOM = "custom",
}

interface GasFeeDetailsProps {
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
  setValue: UseFormSetValue<AddNetworkManualForm>;
  trigger: UseFormTrigger<AddNetworkManualForm>;
}

const GasOptionStandard = ({
  control,
  errors,
}: Omit<GasFeeDetailsProps, "setValue" | "trigger">) => (
  <ControllerInput
    name="gasPrice"
    control={control}
    label="Gas Price"
    variant="fixed-floating"
    type="decimal"
    w="full"
    placeholder="0.00"
    error={errors.gasPrice?.message}
    rules={{ required: "" }}
  />
);

const GasOptionCustom = ({
  control,
  errors,
}: Omit<GasFeeDetailsProps, "setValue" | "trigger">) => (
  <>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          Fixed Minimum Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="fixedMinimumGasPrice"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.fixedMinimumGasPrice?.message}
        rtl
      />
    </Flex>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          Low Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="lowGasPrice"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.lowGasPrice?.message}
        rtl
      />
    </Flex>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          Average Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="averageGasPrice"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.averageGasPrice?.message}
        rtl
      />
    </Flex>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          High Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="highGasPrice"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.highGasPrice?.message}
        rtl
      />
    </Flex>
  </>
);

const GasFeeDetails = ({
  control,
  errors,
  setValue,
  trigger,
}: GasFeeDetailsProps) => {
  const { gasPrice, gasConfig } = useWatch({ control });

  useEffect(() => {
    if (!gasPrice) return;

    if (gasConfig === GasPriceConfiguration.CUSTOM) {
      setValue("gasPrice", "");
      trigger();

      return;
    }

    if (gasConfig === GasPriceConfiguration.STANDARD) {
      setValue("fixedMinimumGasPrice", gasPrice);
      setValue("lowGasPrice", gasPrice);
      setValue("averageGasPrice", gasPrice);
      setValue("highGasPrice", gasPrice);
      trigger();
    }
  }, [gasConfig, setValue, gasPrice, trigger]);

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <CustomNetworkPageHeader title="Add Gas & Fee Details" />
      <Flex w="full" direction="column" gap={8} mt={8}>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas & Fee Details" />
          <Flex gap={6}>
            <ControllerInput
              name="gasAdjustment"
              control={control}
              label="Gas Adjustment"
              variant="fixed-floating"
              type="decimal"
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
              type="decimal"
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
            placeholder="ex. uinit"
            rules={{ required: "" }}
            error={errors.feeTokenDenom?.message}
          />
        </Flex>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas Price Configuration" />
          <RadioGroup
            onChange={(nextVal) =>
              setValue("gasConfig", nextVal as GasPriceConfiguration)
            }
            value={gasConfig}
          >
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap={6} maxW={640}>
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
            </Grid>
          </RadioGroup>
          {gasConfig === GasPriceConfiguration.STANDARD && (
            <GasOptionStandard control={control} errors={errors} />
          )}
          {gasConfig === GasPriceConfiguration.CUSTOM && (
            <GasOptionCustom control={control} errors={errors} />
          )}
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
                  type="decimal"
                  w="full"
                  placeholder="0.00"
                  error={errors.gasForCosmosSend?.message}
                />
                <ControllerInput
                  labelBgColor="gray.900"
                  name="gasForIbc"
                  control={control}
                  label="Gas Cost for IBC"
                  variant="fixed-floating"
                  type="decimal"
                  w="full"
                  placeholder="0.00"
                  error={errors.gasForIbc?.message}
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
