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

import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";
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
    name="gasPrice"
    control={control}
    label="Gas price"
    variant="fixed-floating"
    type="decimal"
    w="full"
    placeholder="0.00"
    error={errors.gasPrice?.message}
    rules={{ required: "" }}
    restrictedNumberInputParams={restrictedNumberInputParams}
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
          Fixed minimum gas price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="fixed_min_gas_price"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.fixed_min_gas_price?.message}
        textAlign="right"
        restrictedNumberInputParams={restrictedNumberInputParams}
      />
    </Flex>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          Low gas price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="low_gas_price"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.low_gas_price?.message}
        textAlign="right"
        restrictedNumberInputParams={restrictedNumberInputParams}
      />
    </Flex>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          Average gas price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="average_gas_price"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.average_gas_price?.message}
        textAlign="right"
        restrictedNumberInputParams={restrictedNumberInputParams}
      />
    </Flex>
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Text variant="body1" color="gray.500">
          High gas price
        </Text>
        <Text variant="body3" color="error.main">
          (Required)
        </Text>
      </Box>
      <ControllerInput
        name="high_gas_price"
        control={control}
        variant="fixed-floating"
        type="decimal"
        w="256px"
        placeholder="0.00"
        error={errors.high_gas_price?.message}
        textAlign="right"
        restrictedNumberInputParams={restrictedNumberInputParams}
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
      <CustomNetworkPageHeader title="Add gas & fee details" />
      <Flex w="full" direction="column" gap={8} mt={8}>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas & fee details" />
          <Flex gap={6}>
            <ControllerInput
              name="gasAdjustment"
              control={control}
              label="Gas adjustment"
              variant="fixed-floating"
              type="decimal"
              w="full"
              placeholder="0.00"
              rules={{ required: "" }}
              error={errors.gasAdjustment?.message}
              restrictedNumberInputParams={restrictedNumberInputParams}
            />
            <ControllerInput
              name="maxGasLimit"
              control={control}
              label="Max gas limit"
              variant="fixed-floating"
              type="decimal"
              w="full"
              placeholder="0.00"
              rules={{ required: "" }}
              error={errors.maxGasLimit?.message}
              restrictedNumberInputParams={restrictedNumberInputParams}
            />
          </Flex>
          <ControllerInput
            name="denom"
            control={control}
            label="Fee tokens denom"
            variant="fixed-floating"
            w="full"
            placeholder="ex. uinit"
            rules={{ required: "" }}
            error={errors.denom?.message}
          />
        </Flex>
        <Flex direction="column" gap={6}>
          <CustomNetworkSubheader title="Gas price configuration" />
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
                Standard gas price
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
            <AccordionPanel pt={0} pb={4}>
              <Flex gap={6} mt={2}>
                <ControllerInput
                  labelBgColor="gray.900"
                  name="cosmos_send"
                  control={control}
                  label="Gas cost for cosmos Send"
                  variant="fixed-floating"
                  type="decimal"
                  w="full"
                  placeholder="0.00"
                  error={errors.cosmos_send?.message}
                  restrictedNumberInputParams={restrictedNumberInputParams}
                />
                <ControllerInput
                  labelBgColor="gray.900"
                  name="ibc_transfer"
                  control={control}
                  label="Gas cost for IBC"
                  variant="fixed-floating"
                  type="decimal"
                  w="full"
                  placeholder="0.00"
                  error={errors.ibc_transfer?.message}
                  restrictedNumberInputParams={restrictedNumberInputParams}
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
