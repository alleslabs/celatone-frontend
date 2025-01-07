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

import type { AddNetworkManualForm } from "../../types";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";

export enum GasPriceConfiguration {
  CUSTOM = "custom",
  STANDARD = "standard",
}

interface GasFeeDetailsProps {
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
  setValue: UseFormSetValue<AddNetworkManualForm>;
  trigger: UseFormTrigger<AddNetworkManualForm>;
}

const restrictedNumberInputParams = {
  maxDecimalPoints: 20,
  maxIntegerPoints: 20,
};

const GasOptionStandard = ({
  control,
  errors,
}: Omit<GasFeeDetailsProps, "setValue" | "trigger">) => (
  <ControllerInput
    label="Gas Price"
    name="gasPrice"
    restrictedNumberInputParams={restrictedNumberInputParams}
    rules={{ required: "" }}
    type="decimal"
    variant="fixed-floating"
    w="full"
    control={control}
    error={errors.gasPrice?.message}
    placeholder="0.00"
  />
);

const GasOptionCustom = ({
  control,
  errors,
}: Omit<GasFeeDetailsProps, "setValue" | "trigger">) => (
  <>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text variant="body1" color="gray.500">
          Fixed Minimum Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="fixed_min_gas_price"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
        control={control}
        error={errors.fixed_min_gas_price?.message}
        placeholder="0.00"
      />
    </Flex>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text variant="body1" color="gray.500">
          Low Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="low_gas_price"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
        control={control}
        error={errors.low_gas_price?.message}
        placeholder="0.00"
      />
    </Flex>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text variant="body1" color="gray.500">
          Average Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="average_gas_price"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
        control={control}
        error={errors.average_gas_price?.message}
        placeholder="0.00"
      />
    </Flex>
    <Flex alignItems="center" justifyContent="space-between">
      <Box>
        <Text variant="body1" color="gray.500">
          High Gas Price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="high_gas_price"
        restrictedNumberInputParams={restrictedNumberInputParams}
        textAlign="right"
        type="decimal"
        variant="fixed-floating"
        w="256px"
        control={control}
        error={errors.high_gas_price?.message}
        placeholder="0.00"
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
    average_gas_price: averageGasPrice,
    fixed_min_gas_price: fixedMinGasPrice,
    gasConfig,
    gasPrice,
    high_gas_price: highGasPrice,
    low_gas_price: lowGasPrice,
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
    <Flex alignItems="center" gap={2} direction="column">
      <CustomNetworkPageHeader title="Add Gas & Fee Details" />
      <Flex gap={8} mt={8} w="full" direction="column">
        <Flex gap={6} direction="column">
          <CustomNetworkSubheader title="Gas & Fee Details" />
          <Flex gap={6}>
            <ControllerInput
              label="Gas Adjustment"
              name="gasAdjustment"
              restrictedNumberInputParams={restrictedNumberInputParams}
              rules={{ required: "" }}
              type="decimal"
              variant="fixed-floating"
              w="full"
              control={control}
              error={errors.gasAdjustment?.message}
              placeholder="0.00"
            />
            <ControllerInput
              label="Max Gas Limit"
              name="maxGasLimit"
              restrictedNumberInputParams={restrictedNumberInputParams}
              rules={{ required: "" }}
              type="decimal"
              variant="fixed-floating"
              w="full"
              control={control}
              error={errors.maxGasLimit?.message}
              placeholder="0.00"
            />
          </Flex>
          <ControllerInput
            label="Fee Tokens Denom"
            name="denom"
            rules={{ required: "" }}
            variant="fixed-floating"
            w="full"
            control={control}
            error={errors.denom?.message}
            placeholder="ex. uinit"
          />
        </Flex>
        <Flex gap={6} direction="column">
          <CustomNetworkSubheader title="Gas Price Configuration" />
          <RadioGroup
            value={gasConfig}
            onChange={(nextVal) =>
              setValue("gasConfig", nextVal as GasPriceConfiguration)
            }
          >
            <Grid gridTemplateColumns="repeat(2, 1fr)" gap={6} maxW={640}>
              <Radio
                width="fit-content"
                value={GasPriceConfiguration.STANDARD}
                variant="gray-card"
              >
                Standard Gas Price
                <Text variant="body3">
                  Set the standard gas price as the default for all gas price
                  configurations
                </Text>
              </Radio>
              <Radio
                width="fit-content"
                value={GasPriceConfiguration.CUSTOM}
                variant="gray-card"
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
        <Accordion w="full" allowToggle>
          <AccordionItem>
            <AccordionButton p={4}>
              <Text>Advanced Options</Text>
              <AccordionIcon ml="auto" boxSize={6} color="gray.600" />
            </AccordionButton>
            <AccordionPanel pb={4} pt={0}>
              <Flex gap={6} mt={2}>
                <ControllerInput
                  label="Gas Cost for Cosmos Send"
                  name="cosmos_send"
                  restrictedNumberInputParams={restrictedNumberInputParams}
                  type="decimal"
                  variant="fixed-floating"
                  w="full"
                  control={control}
                  error={errors.cosmos_send?.message}
                  labelBgColor="gray.900"
                  placeholder="0.00"
                />
                <ControllerInput
                  label="Gas Cost for IBC"
                  name="ibc_transfer"
                  restrictedNumberInputParams={restrictedNumberInputParams}
                  type="decimal"
                  variant="fixed-floating"
                  w="full"
                  control={control}
                  error={errors.ibc_transfer?.message}
                  labelBgColor="gray.900"
                  placeholder="0.00"
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
