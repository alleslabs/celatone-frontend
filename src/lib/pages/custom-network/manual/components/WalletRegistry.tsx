import {
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  IconButton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useController, useFieldArray, useWatch } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

import type { AddNetworkManualForm } from "../../types";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { useAccountBech32 } from "lib/services/account";

interface DenomUnitsProps extends WalletRegistryProps {
  assetIndex: number;
}

interface WalletRegistryProps {
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
}

const DenomUnits = ({ assetIndex, control, errors }: DenomUnitsProps) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: `assets.${assetIndex}.denoms`,
  });

  return fields.length ? (
    <Flex gap={4} direction="column">
      {fields.map((denom, index) => (
        <Flex
          key={denom.id}
          bg="background.main"
          px={6}
          py={4}
          direction="column"
          rounded={8}
        >
          <Flex
            alignItems="center"
            pb={4}
            w="full"
            justifyContent="space-between"
          >
            <Heading mb={2} variant="h7">
              Denom Unit
            </Heading>
            <IconButton
              aria-label="Remove Asset"
              size="sm"
              variant="ghost-gray"
              icon={<CustomIcon name="delete" boxSize={4} />}
              onClick={() => remove(index)}
            />
          </Flex>
          <Grid gridTemplateColumns="repeat(2, 1fr)" gap={4}>
            <ControllerInput
              label="Denom"
              name={`assets.${assetIndex}.denoms.${index}.denom`}
              rules={{
                required: "Denom is required",
              }}
              variant="fixed-floating"
              w="full"
              control={control}
              error={
                errors.assets?.[assetIndex]?.denoms?.[index]?.denom?.message
              }
              placeholder="ex. uinit"
            />
            <ControllerInput
              label="Exponent"
              name={`assets.${assetIndex}.denoms.${index}.exponent`}
              rules={{
                required: "Exponent is required",
              }}
              type="number"
              variant="fixed-floating"
              w="full"
              control={control}
              error={
                errors.assets?.[assetIndex]?.denoms?.[index]?.exponent?.message
              }
              placeholder="ex. 2"
            />
          </Grid>
        </Flex>
      ))}
      <Button
        variant="ghost-primary"
        w="fit-content"
        leftIcon={<CustomIcon name="plus" boxSize={3} />}
        onClick={() => append({ denom: "", exponent: 0 })}
      >
        Add more Denom Unit
      </Button>
    </Flex>
  ) : (
    <Flex
      bg="background.main"
      px={6}
      py={4}
      justifyContent="center"
      rounded={8}
    >
      <Button
        variant="outline-primary"
        w="fit-content"
        leftIcon={<CustomIcon name="plus" boxSize={3} />}
        onClick={() => append({ denom: "", exponent: 0 })}
      >
        Add Denom Unit
      </Button>
    </Flex>
  );
};

export const WalletRegistry = ({ control, errors }: WalletRegistryProps) => {
  const [lcd, bech32Prefix] = useWatch({
    control,
    name: ["lcd", "bech32_prefix"],
  });

  const { data: accountBech32, isLoading: isAccountBech32Loading } =
    useAccountBech32(lcd);

  const {
    field: { onChange },
  } = useController({
    control,
    name: "bech32_prefix",
  });

  useEffect(() => {
    if (isAccountBech32Loading || accountBech32?.bech32Prefix === bech32Prefix)
      return;

    onChange(accountBech32?.bech32Prefix ?? "init");
  }, [
    isAccountBech32Loading,
    accountBech32?.bech32Prefix,
    bech32Prefix,
    onChange,
  ]);

  const { append, fields, remove } = useFieldArray({
    control,
    name: "assets",
  });

  return (
    <Flex alignItems="center" gap={2} direction="column">
      <CustomNetworkPageHeader title="Add Wallet Registry" />
      <Flex gap={6} my={8} w="full" direction="column">
        <CustomNetworkSubheader
          subtitle="This information is fetched from provided LCD URL"
          title="Account Prefix and Registered Coin Type"
        />
        <Stack bg="gray.900" gap={4} px={6} py={4} rounded={8}>
          <Grid gridTemplateColumns="repeat(2, 1fr)" gap={6}>
            <LabelText label="Bech32">
              {isAccountBech32Loading ? (
                <SkeletonText noOfLines={1} skeletonHeight={4} />
              ) : (
                accountBech32?.bech32Prefix ?? "init"
              )}
            </LabelText>
            <LabelText label="Slip44">118</LabelText>
          </Grid>
          <Flex
            pl={4}
            borderColor="gray.100"
            borderLeft="2px solid"
            direction="column"
          >
            <Text variant="body2" color="text.dark" fontWeight={600}>
              Account address in this Minitia will look like this:
            </Text>
            {isAccountBech32Loading ? (
              <SkeletonText noOfLines={1} skeletonHeight={4} />
            ) : (
              <Text variant="body2" color="text.main">
                {accountBech32?.bech32Prefix ?? "init"}
                1cvhde2nst3qewz8x58m6tuupfk08zspeev4ud3
              </Text>
            )}
          </Flex>
          {!isAccountBech32Loading && !accountBech32 && (
            <>
              <Divider />
              <Text variant="body2" color="warning.main">
                * Bech32 and Slip44 data is not available from LCD. The input
                above will be set as default.
              </Text>
            </>
          )}
        </Stack>
      </Flex>
      <Flex gap={6} mb={8} w="full" direction="column">
        <CustomNetworkSubheader
          subtitle="List the available supported tokens in this network"
          title="Assets"
        />
        {fields.length ? (
          <Flex gap={4} direction="column">
            {fields.map((asset, index) => (
              <Flex
                key={asset.id}
                px={6}
                py={4}
                w="full"
                background="gray.900"
                direction="column"
                justifyContent="center"
                rounded={8}
              >
                <Flex alignItems="center" pb={4} justifyContent="space-between">
                  <Heading mb={2} variant="h7">
                    Asset
                  </Heading>
                  <IconButton
                    aria-label="Remove Asset"
                    size="sm"
                    variant="ghost-gray"
                    icon={<CustomIcon name="delete" boxSize={4} />}
                    onClick={() => remove(index)}
                  />
                </Flex>
                <Flex gap={4} direction="column">
                  <ControllerInput
                    label="Name"
                    name={`assets.${index}.name` as const}
                    rules={{
                      required: "Name is required",
                    }}
                    variant="fixed-floating"
                    control={control}
                    error={errors.assets?.[index]?.name?.message}
                    labelBgColor="gray.900"
                    placeholder="ex. Init"
                  />
                  <ControllerInput
                    label="Base"
                    name={`assets.${index}.base` as const}
                    rules={{
                      required: "Base is required",
                    }}
                    variant="fixed-floating"
                    control={control}
                    error={errors.assets?.[index]?.base?.message}
                    labelBgColor="gray.900"
                    placeholder="ex. uinit"
                  />
                  <ControllerInput
                    label="Symbol"
                    name={`assets.${index}.symbol` as const}
                    rules={{
                      required: "Symbol is required",
                    }}
                    variant="fixed-floating"
                    control={control}
                    error={errors.assets?.[index]?.symbol?.message}
                    labelBgColor="gray.900"
                    placeholder="ex. INIT"
                  />
                </Flex>
                <Flex mt={4} w="full" direction="column">
                  <Flex
                    alignItems="center"
                    pb={4}
                    justifyContent="space-between"
                  >
                    <Heading variant="h7">Denom Units</Heading>
                  </Flex>
                  <DenomUnits
                    assetIndex={index}
                    control={control}
                    errors={errors}
                  />
                </Flex>
              </Flex>
            ))}
            <Button
              variant="ghost-primary"
              w="fit-content"
              leftIcon={<CustomIcon name="plus" boxSize={3} />}
              onClick={() =>
                append({ base: "", denoms: [], name: "", symbol: "" })
              }
            >
              Add more Asset
            </Button>
          </Flex>
        ) : (
          <Flex gap={4} direction="column">
            <Flex
              bg="gray.900"
              px={6}
              py={4}
              justifyContent="center"
              rounded={8}
            >
              <Button
                variant="outline-primary"
                w="fit-content"
                leftIcon={<CustomIcon name="plus" boxSize={3} />}
                onClick={() =>
                  append({ base: "", denoms: [], name: "", symbol: "" })
                }
              >
                Add More Asset
              </Button>
            </Flex>
            <Text variant="body2" color="text.disabled">
              Without asset information, the website remains functional.
              However, with the wallet provider, assets may appear in a long
              format.
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};
