import { Button, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { Control, FieldErrors } from "react-hook-form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";

import { AddNetworkHeader } from "./components/AddNetworkHeader";
import { AddNetworkSubheader } from "./components/AddNetworkSubheader";

// interface DenomUnit {
//   denom: string;
//   exponent: number;
// }

// interface Asset {
//   name: string;
//   base: string;
//   symbol: string;
//   denomUnits: DenomUnit[];
// }

const schema = z.object({
  bech32Prefix: z.string(),
  slip44: z.string(),
  assets: z.array(
    z.object({
      name: z.string(),
      base: z.string(),
      symbol: z.string(),
      denomUnits: z.array(
        z.object({
          denom: z.string(),
          exponent: z.string(),
        })
      ),
    })
  ),
});

type FormData = z.infer<typeof schema>;

interface DenomUnitsProps {
  control: Control<FormData>;
  assetIndex: number;
  errors: FieldErrors<FormData>;
}
const DenomUnits = ({ control, assetIndex, errors }: DenomUnitsProps) => {
  const {
    fields: denomFields,
    append: appendDenom,
    remove: removeDenom,
  } = useFieldArray({
    control,
    name: `assets.${assetIndex}.denomUnits` as const,
  });

  return (
    <Flex direction="column" w="full">
      {denomFields.length ? (
        <Flex direction="column" gap={2}>
          {denomFields.map((unit, unitIndex) => (
            <Flex
              key={unit.id}
              direction="column"
              gap={2}
              mb={2}
              p={4}
              borderRadius={8}
              background="background.main"
            >
              <Flex alignItems="center" justifyContent="space-between" pb={2}>
                <Heading variant="h7">Denom Unit - {unitIndex + 1}</Heading>
                <IconButton
                  aria-label="Remove Asset"
                  icon={<CustomIcon name="delete" boxSize={4} />}
                  onClick={() => removeDenom(assetIndex)}
                  variant="ghost-gray"
                  size="sm"
                />
              </Flex>
              <Flex gap={4}>
                <ControllerInput
                  name={
                    `assets.${assetIndex}.denomUnits.${unitIndex}.denom` as const
                  }
                  control={control}
                  label="Denom"
                  variant="fixed-floating"
                  w="full"
                  placeholder="ex. uinit"
                  rules={{
                    required: "Denom is required",
                  }}
                  error={
                    errors.assets?.[assetIndex]?.denomUnits?.[unitIndex]?.denom
                      ?.message
                  }
                />
                <ControllerInput
                  name={
                    `assets.${assetIndex}.denomUnits.${unitIndex}.exponent` as const
                  }
                  control={control}
                  label="Exponent"
                  variant="fixed-floating"
                  w="full"
                  placeholder="ex. 2"
                  rules={{
                    required: "Exponent is required",
                  }}
                  error={
                    errors.assets?.[assetIndex]?.denomUnits?.[unitIndex]
                      ?.exponent?.message
                  }
                />
              </Flex>
            </Flex>
          ))}
          <Button
            variant="ghost-primary"
            onClick={() => appendDenom({ denom: "", exponent: "" })}
          >
            <CustomIcon name="plus" boxSize={4} mr={2} />
            Add more Denom Unit
          </Button>
        </Flex>
      ) : (
        <Flex
          background="background.main"
          px={6}
          py={4}
          borderRadius={8}
          justifyContent="center"
          w="full"
        >
          <Button
            variant="outline-primary"
            onClick={() => appendDenom({ denom: "", exponent: "" })}
            leftIcon={<CustomIcon name="plus" boxSize={3} />}
          >
            Add Denom
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

const WalletRegistry = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      bech32Prefix: "",
      slip44: "118",
      assets: [],
    },
  });

  const bech32Prefix = useWatch({
    control,
    name: "bech32Prefix",
  });

  const [debouncedBech32Prefix, setDebouncedBech32Prefix] =
    useState(bech32Prefix);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBech32Prefix(bech32Prefix);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [bech32Prefix]);

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({
    control,
    name: "assets",
  });

  return (
    <Flex direction="column" gap={2} alignItems="center">
      <AddNetworkHeader title="Add Wallet Registry" />
      <Flex w="full" direction="column" gap={6} my={8}>
        <AddNetworkSubheader title="Account Prefix and Registered Coin Type" />
        <Flex gap={6}>
          <ControllerInput
            name="bech32Prefix"
            control={control}
            label="Bech32 Prefix"
            variant="fixed-floating"
            w="full"
            placeholder="ex. Init"
            rules={{
              required: "",
            }}
            error={errors.bech32Prefix?.message}
          />
          <ControllerInput
            name="slip44"
            control={control}
            label="Slip44"
            variant="fixed-floating"
            w="full"
            defaultValue="118"
            rules={{
              required: "",
            }}
            error={errors.slip44?.message}
          />
        </Flex>
        {debouncedBech32Prefix && (
          <Flex
            direction="column"
            gap={1}
            px={4}
            borderLeft="2px solid"
            borderColor="gray.100"
          >
            <Text variant="body2" color="text.dark" fontWeight={600}>
              Account address in this Minitia will look like this:
            </Text>
            <Text variant="body2" color="text.main">
              {debouncedBech32Prefix}
              1cvhde2nst3qewz8x58m6tuupfk08zspeev4ud3
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex w="full" direction="column" gap={6} mb={8}>
        <AddNetworkSubheader
          title="Assets"
          subtitle="List the available supported tokens in this network"
        />
        <Flex direction="column">
          {assetFields.length ? (
            <Flex direction="column" w="full" gap={6}>
              {assetFields.map((item, index) => (
                <Flex
                  key={item.id}
                  direction="column"
                  background="gray.900"
                  px={6}
                  py={4}
                  borderRadius={8}
                  justifyContent="center"
                  w="full"
                >
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    pb={4}
                  >
                    <Heading variant="h7" mb={2}>
                      Asset
                    </Heading>
                    <IconButton
                      aria-label="Remove Asset"
                      icon={<CustomIcon name="delete" boxSize={4} />}
                      onClick={() => removeAsset(index)}
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
                      assetIndex={index}
                      errors={errors}
                    />
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Flex
              background="gray.900"
              px={6}
              py={4}
              borderRadius={8}
              justifyContent="center"
              w="full"
            >
              <Button
                variant="outline-primary"
                onClick={() =>
                  appendAsset({
                    name: "",
                    base: "",
                    symbol: "",
                    denomUnits: [],
                  })
                }
                leftIcon={<CustomIcon name="plus" boxSize={3} />}
              >
                Add Asset
              </Button>
            </Flex>
          )}
        </Flex>
        {assetFields.length ? (
          <Button
            variant="ghost-primary"
            onClick={() =>
              appendAsset({ name: "", base: "", symbol: "", denomUnits: [] })
            }
            leftIcon={<CustomIcon name="plus" boxSize={3} />}
          >
            Add More Asset
          </Button>
        ) : (
          <Text variant="body2" color="text.disabled">
            Without asset information, the website remains functional. However,
            with the wallet provider, assets may appear in a long format.
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default WalletRegistry;
