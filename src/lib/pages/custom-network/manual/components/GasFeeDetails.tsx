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
    label="Gas price"
    variant="fixed-floating"
    type="decimal"
    w="full"
    placeholder="0.00"
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
        <Text variant="body1" color="gray.500">
          Fixed minimum gas price
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
        <Text variant="body1" color="gray.500">
          Low gas price
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
        <Text variant="body1" color="gray.500">
          Average gas price
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
        <Text variant="body1" color="gray.500">
          High gas price
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
    <Flex direction="column" gap={2} alignItems="center">
      <CustomNetworkPageHeader title="Add Gas & Fee details" />
      <Flex w="full" direction="column" gap={8} mt={8}>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas & Fee details" />
          <Flex gap={6}>
            <ControllerInput
              control={control}
              label="Gas adjustment"
              variant="fixed-floating"
              type="decimal"
              w="full"
              placeholder="0.00"
              rules={{ required: "" }}
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
              label="Max gas limit"
              variant="fixed-floating"
              type="decimal"
              w="full"
              placeholder="0.00"
              rules={{ required: "" }}
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
            label="Fee tokens denom"
            variant="fixed-floating"
            w="full"
            placeholder="ex. uinit"
            rules={{ required: "" }}
            variant="fixed-floating"
            w="full"
          />
        </Flex>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas price configuration" />
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
                Standard gas price
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
                Custom gas prices
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
              <Text>Advanced options</Text>
              <AccordionIcon color="gray.600" ml="auto" boxSize={6} />
            </AccordionButton>
            <AccordionPanel pb={4} pt={0}>
              <Flex gap={6} mt={2}>
                <ControllerInput
                  control={control}
                  error={errors.cosmos_send?.message}
                  label="Gas Cost for Cosmos Send"
                  labelBgColor="gray.900"
                  name="cosmos_send"
                  control={control}
                  label="Gas cost for cosmos Send"
                  variant="fixed-floating"
                  type="decimal"
                  w="full"
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
                  control={control}
                  label="Gas cost for IBC"
                  variant="fixed-floating"
                  type="decimal"
                  w="full"
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
