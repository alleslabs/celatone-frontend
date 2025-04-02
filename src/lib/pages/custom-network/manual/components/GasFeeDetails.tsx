import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

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
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";
import { useEffect } from "react";
import { useWatch } from "react-hook-form";

import type { AddNetworkManualForm } from "../../types";

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

const restrictedNumberInputParams = {
  maxIntegerPoints: 20,
  maxDecimalPoints: 20,
};

const GasOptionStandard = ({
  control,
  errors,
}: Omit<GasFeeDetailsProps, "setValue" | "trigger">) => (
  <ControllerInput
    control={control}
    error={errors.gasPrice?.message}
    label="Gas Price"
    name="gasPrice"
    placeholder="0.00"
    restrictedNumberInputParams={restrictedNumberInputParams}
    rules={{ required: "" }}
    type="decimal"
    variant="fixed-floating"
    w="full"
  />
);

const GasOptionCustom = ({
  control,
  errors,
}: Omit<GasFeeDetailsProps, "setValue" | "trigger">) => (
  <>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text color="gray.500" variant="body1">
          Fixed Minimum Gas Price
        </Text>
        <Text color="error.main" variant="body3">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        control={control}
        error={errors.fixed_min_gas_price?.message}
        name="fixed_min_gas_price"
        placeholder="0.00"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
      />
    </Flex>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text color="gray.500" variant="body1">
          Low Gas Price
        </Text>
        <Text color="error.main" variant="body3">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        control={control}
        error={errors.low_gas_price?.message}
        name="low_gas_price"
        placeholder="0.00"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
      />
    </Flex>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text color="gray.500" variant="body1">
          Average Gas Price
        </Text>
        <Text color="error.main" variant="body3">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        control={control}
        error={errors.average_gas_price?.message}
        name="average_gas_price"
        placeholder="0.00"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
      />
    </Flex>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text color="gray.500" variant="body1">
          High Gas Price
        </Text>
        <Text color="error.main" variant="body3">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        control={control}
        error={errors.high_gas_price?.message}
        name="high_gas_price"
        placeholder="0.00"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
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
  const {
    gasPrice,
    gasConfig,
    fixed_min_gas_price: fixedMinGasPrice,
    low_gas_price: lowGasPrice,
    average_gas_price: averageGasPrice,
    high_gas_price: highGasPrice,
  } = useWatch({ control });

  useEffect(() => {
    if (!gasPrice) return;

    if (gasConfig === GasPriceConfiguration.CUSTOM) {
      const isCustomValueEqual =
        fixedMinGasPrice === lowGasPrice &&
        lowGasPrice === averageGasPrice &&
        averageGasPrice === highGasPrice;

      setValue("gasPrice", isCustomValueEqual ? fixedMinGasPrice : undefined);
      trigger();

      return;
    }

    if (gasConfig === GasPriceConfiguration.STANDARD) {
      setValue("fixed_min_gas_price", gasPrice);
      setValue("low_gas_price", gasPrice);
      setValue("average_gas_price", gasPrice);
      setValue("high_gas_price", gasPrice);
      trigger();
    }
  }, [
    gasConfig,
    setValue,
    gasPrice,
    trigger,
    fixedMinGasPrice,
    lowGasPrice,
    averageGasPrice,
    highGasPrice,
  ]);

  return (
    <Flex alignItems="center" direction="column" gap={2}>
      <CustomNetworkPageHeader title="Add Gas & Fee Details" />
      <Flex direction="column" gap={8} mt={8} w="full">
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas & Fee Details" />
          <Flex gap={6}>
            <ControllerInput
              control={control}
              error={errors.gasAdjustment?.message}
              label="Gas Adjustment"
              name="gasAdjustment"
              placeholder="0.00"
              restrictedNumberInputParams={restrictedNumberInputParams}
              rules={{ required: "" }}
              type="decimal"
              variant="fixed-floating"
              w="full"
            />
            <ControllerInput
              control={control}
              error={errors.maxGasLimit?.message}
              label="Max Gas Limit"
              name="maxGasLimit"
              placeholder="0.00"
              restrictedNumberInputParams={restrictedNumberInputParams}
              rules={{ required: "" }}
              type="decimal"
              variant="fixed-floating"
              w="full"
            />
          </Flex>
          <ControllerInput
            control={control}
            error={errors.denom?.message}
            label="Fee Tokens Denom"
            name="denom"
            placeholder="ex. uinit"
            rules={{ required: "" }}
            variant="fixed-floating"
            w="full"
          />
        </Flex>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas Price Configuration" />
          <RadioGroup
            value={gasConfig}
            onChange={(nextVal) =>
              setValue("gasConfig", nextVal as GasPriceConfiguration)
            }
          >
            <Grid gap={6} gridTemplateColumns="repeat(2, 1fr)" maxW={640}>
              <Radio
                value={GasPriceConfiguration.STANDARD}
                variant="gray-card"
                width="fit-content"
              >
                Standard Gas Price
                <Text variant="body3">
                  Set the standard gas price as the default for all gas price
                  configurations
                </Text>
              </Radio>
              <Radio
                value={GasPriceConfiguration.CUSTOM}
                variant="gray-card"
                width="fit-content"
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
              <AccordionIcon boxSize={6} color="gray.600" ml="auto" />
            </AccordionButton>
            <AccordionPanel pb={4} pt={0}>
              <Flex gap={6} mt={2}>
                <ControllerInput
                  control={control}
                  error={errors.cosmos_send?.message}
                  label="Gas Cost for Cosmos Send"
                  labelBgColor="gray.900"
                  name="cosmos_send"
                  placeholder="0.00"
                  restrictedNumberInputParams={restrictedNumberInputParams}
                  type="decimal"
                  variant="fixed-floating"
                  w="full"
                />
                <ControllerInput
                  control={control}
                  error={errors.ibc_transfer?.message}
                  label="Gas Cost for IBC"
                  labelBgColor="gray.900"
                  name="ibc_transfer"
                  placeholder="0.00"
                  restrictedNumberInputParams={restrictedNumberInputParams}
                  type="decimal"
                  variant="fixed-floating"
                  w="full"
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
