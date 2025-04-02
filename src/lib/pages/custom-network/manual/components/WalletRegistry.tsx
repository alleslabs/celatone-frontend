import type { Control, FieldErrors } from "react-hook-form";

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
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { useAccountBech32 } from "lib/services/account";
import { useEffect } from "react";
import { useController, useFieldArray, useWatch } from "react-hook-form";

import type { AddNetworkManualForm } from "../../types";

import { DEFAULT_SLIP44 } from "../../constant";

interface WalletRegistryProps {
  control: Control<AddNetworkManualForm>;
  errors: FieldErrors<AddNetworkManualForm>;
}

interface DenomUnitsProps extends WalletRegistryProps {
  assetIndex: number;
}

const DenomUnits = ({ control, assetIndex, errors }: DenomUnitsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `assets.${assetIndex}.denoms`,
  });

  return fields.length ? (
    <Flex direction="column" gap={4}>
      {fields.map((denom, index) => (
        <Flex
          key={denom.id}
          bg="background.main"
          direction="column"
          px={6}
          py={4}
          rounded={8}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            pb={4}
            w="full"
          >
            <Heading mb={2} variant="h7">
              Denom Unit
            </Heading>
            <IconButton
              aria-label="Remove Asset"
              icon={<CustomIcon boxSize={4} name="delete" />}
              size="sm"
              variant="ghost-gray"
              onClick={() => remove(index)}
            />
          </Flex>
          <Grid gap={4} gridTemplateColumns="repeat(2, 1fr)">
            <ControllerInput
              control={control}
              error={
                errors.assets?.[assetIndex]?.denoms?.[index]?.denom?.message
              }
              label="Denom"
              name={`assets.${assetIndex}.denoms.${index}.denom`}
              placeholder="ex. uinit"
              rules={{
                required: "Denom is required",
              }}
              variant="fixed-floating"
              w="full"
            />
            <ControllerInput
              control={control}
              error={
                errors.assets?.[assetIndex]?.denoms?.[index]?.exponent?.message
              }
              label="Exponent"
              name={`assets.${assetIndex}.denoms.${index}.exponent`}
              placeholder="ex. 2"
              rules={{
                required: "Exponent is required",
              }}
              type="number"
              variant="fixed-floating"
              w="full"
            />
          </Grid>
        </Flex>
      ))}
      <Button
        leftIcon={<CustomIcon boxSize={3} name="plus" />}
        variant="ghost-primary"
        w="fit-content"
        onClick={() => append({ denom: "", exponent: 0 })}
      >
        Add more Denom Unit
      </Button>
    </Flex>
  ) : (
    <Flex
      bg="background.main"
      justifyContent="center"
      px={6}
      py={4}
      rounded={8}
    >
      <Button
        leftIcon={<CustomIcon boxSize={3} name="plus" />}
        variant="outline-primary"
        w="fit-content"
        onClick={() => append({ denom: "", exponent: 0 })}
      >
        Add Denom Unit
      </Button>
    </Flex>
  );
};

export const WalletRegistry = ({ control, errors }: WalletRegistryProps) => {
  const [rest, bech32Prefix] = useWatch({
    control,
    name: ["rest", "bech32_prefix"],
  });

  const { data: accountBech32, isLoading: isAccountBech32Loading } =
    useAccountBech32(rest);

  const {
    field: { onChange },
  } = useController({
    name: "bech32_prefix",
    control,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });

  return (
    <Flex alignItems="center" direction="column" gap={2}>
      <CustomNetworkPageHeader title="Add Wallet Registry" />
      <Flex direction="column" gap={6} my={8} w="full">
        <CustomNetworkSubheader
          subtitle="This information is fetched from provided REST URL"
          title="Account Prefix and Registered Coin Type"
        />
        <Stack bg="gray.900" gap={4} px={6} py={4} rounded={8}>
          <Grid gap={6} gridTemplateColumns="repeat(2, 1fr)">
            <LabelText label="Bech32">
              {isAccountBech32Loading ? (
                <SkeletonText noOfLines={1} skeletonHeight={4} />
              ) : (
                (accountBech32?.bech32Prefix ?? "init")
              )}
            </LabelText>
            <LabelText label="Slip44">{`${DEFAULT_SLIP44}`}</LabelText>
          </Grid>
          <Flex
            borderColor="gray.100"
            borderLeftWidth="2px"
            borderStyle="solid"
            direction="column"
            pl={4}
          >
            <Text color="text.dark" fontWeight={600} variant="body2">
              Account address in this Rollup will look like this:
            </Text>
            {isAccountBech32Loading ? (
              <SkeletonText noOfLines={1} skeletonHeight={4} />
            ) : (
              <Text color="text.main" variant="body2">
                {accountBech32?.bech32Prefix ?? "init"}
                1cvhde2nst3qewz8x58m6tuupfk08zspeev4ud3
              </Text>
            )}
          </Flex>
          {!isAccountBech32Loading && !accountBech32 && (
            <>
              <Divider />
              <Text color="warning.main" variant="body2">
                * Bech32 and Slip44 data is not available from REST. The input
                above will be set as default.
              </Text>
            </>
          )}
        </Stack>
      </Flex>
      <Flex direction="column" gap={6} mb={8} w="full">
        <CustomNetworkSubheader
          subtitle="List the available supported tokens in this network"
          title="Assets"
        />
        {fields.length ? (
          <Flex direction="column" gap={4}>
            {fields.map((asset, index) => (
              <Flex
                key={asset.id}
                background="gray.900"
                direction="column"
                justifyContent="center"
                px={6}
                py={4}
                rounded={8}
                w="full"
              >
                <Flex alignItems="center" justifyContent="space-between" pb={4}>
                  <Heading mb={2} variant="h7">
                    Asset
                  </Heading>
                  <IconButton
                    aria-label="Remove Asset"
                    icon={<CustomIcon boxSize={4} name="delete" />}
                    size="sm"
                    variant="ghost-gray"
                    onClick={() => remove(index)}
                  />
                </Flex>
                <Flex direction="column" gap={4}>
                  <ControllerInput
                    control={control}
                    error={errors.assets?.[index]?.name?.message}
                    label="Name"
                    labelBgColor="gray.900"
                    name={`assets.${index}.name` as const}
                    placeholder="ex. Init"
                    rules={{
                      required: "Name is required",
                    }}
                    variant="fixed-floating"
                  />
                  <ControllerInput
                    control={control}
                    error={errors.assets?.[index]?.base?.message}
                    label="Base"
                    labelBgColor="gray.900"
                    name={`assets.${index}.base` as const}
                    placeholder="ex. uinit"
                    rules={{
                      required: "Base is required",
                    }}
                    variant="fixed-floating"
                  />
                  <ControllerInput
                    control={control}
                    error={errors.assets?.[index]?.symbol?.message}
                    label="Symbol"
                    labelBgColor="gray.900"
                    name={`assets.${index}.symbol` as const}
                    placeholder="ex. INIT"
                    rules={{
                      required: "Symbol is required",
                    }}
                    variant="fixed-floating"
                  />
                </Flex>
                <Flex direction="column" mt={4} w="full">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    pb={4}
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
              leftIcon={<CustomIcon boxSize={3} name="plus" />}
              variant="ghost-primary"
              w="fit-content"
              onClick={() =>
                append({ name: "", base: "", symbol: "", denoms: [] })
              }
            >
              Add more Asset
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" gap={4}>
            <Flex
              bg="gray.900"
              justifyContent="center"
              px={6}
              py={4}
              rounded={8}
            >
              <Button
                leftIcon={<CustomIcon boxSize={3} name="plus" />}
                variant="outline-primary"
                w="fit-content"
                onClick={() =>
                  append({ name: "", base: "", symbol: "", denoms: [] })
                }
              >
                Add More Asset
              </Button>
            </Flex>
            <Text color="text.disabled" variant="body2">
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
