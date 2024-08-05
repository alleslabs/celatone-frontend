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

import type { AddNetworkManualForm } from "../types";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { LabelText } from "lib/components/LabelText";
import { useAccountBech32 } from "lib/services/account";

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
          px={6}
          py={4}
          bg="background.main"
          rounded={8}
          direction="column"
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            pb={4}
            w="full"
          >
            <Heading variant="h7" mb={2}>
              Denom Unit
            </Heading>
            <IconButton
              aria-label="Remove Asset"
              icon={<CustomIcon name="delete" boxSize={4} />}
              onClick={() => remove(index)}
              variant="ghost-gray"
              size="sm"
            />
          </Flex>
          <Grid gap={4} gridTemplateColumns="repeat(2, 1fr)">
            <ControllerInput
              name={`assets.${assetIndex}.denoms.${index}.denom`}
              control={control}
              label="Denom"
              variant="fixed-floating"
              w="full"
              placeholder="ex. uinit"
              rules={{
                required: "Denom is required",
              }}
              error={
                errors.assets?.[assetIndex]?.denoms?.[index]?.denom?.message
              }
            />
            <ControllerInput
              name={`assets.${assetIndex}.denoms.${index}.exponent`}
              control={control}
              label="Exponent"
              variant="fixed-floating"
              type="number"
              w="full"
              placeholder="ex. 2"
              rules={{
                required: "Exponent is required",
              }}
              error={
                errors.assets?.[assetIndex]?.denoms?.[index]?.exponent?.message
              }
            />
          </Grid>
        </Flex>
      ))}
      <Button
        variant="ghost-secondary"
        w="fit-content"
        onClick={() => append({ denom: "", exponent: "" })}
        leftIcon={<CustomIcon name="plus" boxSize={3} />}
      >
        Add more Denom Unit
      </Button>
    </Flex>
  ) : (
    <Flex
      px={6}
      py={4}
      bg="background.main"
      rounded={8}
      justifyContent="center"
    >
      <Button
        variant="outline-secondary"
        w="fit-content"
        onClick={() => append({ denom: "", exponent: "" })}
        leftIcon={<CustomIcon name="plus" boxSize={3} />}
      >
        Add Denom Unit
      </Button>
    </Flex>
  );
};

export const WalletRegistry = ({ control, errors }: WalletRegistryProps) => {
  const [lcdUrl, bech32Prefix] = useWatch({
    control,
    name: ["lcdUrl", "bech32Prefix"],
  });

  const { data: accountBech32, isLoading: isAccountBech32Loading } =
    useAccountBech32(lcdUrl);

  const {
    field: { onChange },
  } = useController({
    name: "bech32Prefix",
    control,
  });

  useEffect(() => {
    if (accountBech32?.bech32Prefix === bech32Prefix) return;
    onChange(accountBech32?.bech32Prefix ?? "init");
  }, [accountBech32?.bech32Prefix, bech32Prefix, onChange]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "assets",
  });

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <CustomNetworkPageHeader title="Add Wallet Registry" />
      <Flex w="full" direction="column" gap={6} my={8}>
        <CustomNetworkSubheader
          title="Account Prefix and Registered Coin Type"
          subtitle="This information is fetched from provided LCD URL"
        />
        <Stack bg="gray.900" py={4} px={6} rounded={8} gap={4}>
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
            direction="column"
            pl={4}
            borderLeft="2px solid"
            borderColor="gray.100"
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
      <Flex w="full" direction="column" gap={6} mb={8}>
        <CustomNetworkSubheader
          title="Assets"
          subtitle="List the available supported tokens in this network"
        />
        {fields.length ? (
          <Flex direction="column" gap={4}>
            {fields.map((asset, index) => (
              <Flex
                key={asset.id}
                direction="column"
                background="gray.900"
                px={6}
                py={4}
                rounded={8}
                justifyContent="center"
                w="full"
              >
                <Flex alignItems="center" justifyContent="space-between" pb={4}>
                  <Heading variant="h7" mb={2}>
                    Asset
                  </Heading>
                  <IconButton
                    aria-label="Remove Asset"
                    icon={<CustomIcon name="delete" boxSize={4} />}
                    onClick={() => remove(index)}
                    variant="ghost-gray"
                    size="sm"
                  />
                </Flex>
                <Flex gap={4} direction="column">
                  <ControllerInput
                    name={`assets.${index}.name` as const}
                    control={control}
                    label="Name"
                    variant="fixed-floating"
                    labelBgColor="gray.900"
                    placeholder="ex. Init"
                    rules={{
                      required: "Name is required",
                    }}
                    error={errors.assets?.[index]?.name?.message}
                  />
                  <ControllerInput
                    name={`assets.${index}.base` as const}
                    control={control}
                    label="Base"
                    variant="fixed-floating"
                    labelBgColor="gray.900"
                    placeholder="ex. uinit"
                    rules={{
                      required: "Base is required",
                    }}
                    error={errors.assets?.[index]?.base?.message}
                  />
                  <ControllerInput
                    name={`assets.${index}.symbol` as const}
                    control={control}
                    label="Symbol"
                    variant="fixed-floating"
                    labelBgColor="gray.900"
                    placeholder="ex. INIT"
                    rules={{
                      required: "Symbol is required",
                    }}
                    error={errors.assets?.[index]?.symbol?.message}
                  />
                </Flex>
                <Flex mt={4} w="full" direction="column">
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    pb={4}
                  >
                    <Heading variant="h7">Denom Units</Heading>
                  </Flex>
                  <DenomUnits
                    control={control}
                    errors={errors}
                    assetIndex={index}
                  />
                </Flex>
              </Flex>
            ))}
            <Button
              variant="ghost-secondary"
              w="fit-content"
              onClick={() =>
                append({ name: "", base: "", symbol: "", denoms: [] })
              }
              leftIcon={<CustomIcon name="plus" boxSize={3} />}
            >
              Add more Asset
            </Button>
          </Flex>
        ) : (
          <Flex direction="column" gap={4}>
            <Flex
              px={6}
              py={4}
              bg="gray.900"
              rounded={8}
              justifyContent="center"
            >
              <Button
                variant="outline-secondary"
                w="fit-content"
                onClick={() =>
                  append({ name: "", base: "", symbol: "", denoms: [] })
                }
                leftIcon={<CustomIcon name="plus" boxSize={3} />}
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
