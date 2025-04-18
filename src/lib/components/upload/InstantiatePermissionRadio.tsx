import type { BechAddr, UploadSectionState } from "lib/types";
import type { Control, UseFormSetValue, UseFormTrigger } from "react-hook-form";

import { Box, Button, Flex, Radio, RadioGroup, Text } from "@chakra-ui/react";
import { AmpEvent, track, trackUseInstantiatePermission } from "lib/amplitude";
import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AccessType } from "lib/types";
import { useEffect } from "react";
import { useController, useFieldArray, useWatch } from "react-hook-form";

import { AddressInput } from "../AddressInput";
import { AssignMe } from "../AssignMe";

interface InstantiatePermissionRadioProps {
  control: Control<UploadSectionState>;
  setValue: UseFormSetValue<UploadSectionState>;
  trigger: UseFormTrigger<UploadSectionState>;
}

interface PermissionRadioProps {
  isSelected: boolean;
  value: AccessType;
  text: string;
}

const PermissionRadio = ({ isSelected, text, value }: PermissionRadioProps) => (
  <Radio py={2} value={value.toString()} width="100%">
    <Text fontWeight={isSelected ? "600" : "400"}>{text} </Text>
  </Radio>
);

export const InstantiatePermissionRadio = ({
  control,
  setValue,
  trigger,
}: InstantiatePermissionRadioProps) => {
  const { address: walletAddress } = useCurrentChain();
  const {
    chainConfig: {
      extra: { disableAnyOfAddresses },
    },
  } = useCelatoneApp();

  const { append, fields, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const [permission, addresses] = useWatch({
    control,
    name: ["permission", "addresses"],
  });

  const {
    formState: { errors },
  } = useController({
    control,
    name: "addresses",
  });

  useEffect(() => {
    const emptyAddressesLength = addresses.filter(
      (addr) => addr.address.trim().length === 0
    ).length;
    trackUseInstantiatePermission(
      AccessType[permission],
      emptyAddressesLength,
      addresses.length - emptyAddressesLength
    );
    // Run this effect only when the amount of address input or selected permission changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses.length, permission]);

  return (
    <RadioGroup
      name="instantiatePermission"
      value={permission.toString()}
      onChange={(nextValue: string) => {
        const value = parseInt(nextValue, 10);
        setValue("permission", value);
      }}
    >
      <Box>
        <PermissionRadio
          isSelected={permission === AccessType.ACCESS_TYPE_EVERYBODY}
          text="Anyone can instantiate (Everybody)"
          value={AccessType.ACCESS_TYPE_EVERYBODY}
        />
        <PermissionRadio
          isSelected={permission === AccessType.ACCESS_TYPE_NOBODY}
          text="Instantiate through governance only (Nobody)"
          value={AccessType.ACCESS_TYPE_NOBODY}
        />
        {!disableAnyOfAddresses && (
          <Box>
            <PermissionRadio
              isSelected={
                permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES
              }
              text="Only a set of addresses can instantiate (AnyOfAddresses)"
              value={AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}
            />
            {permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES && (
              <Box>
                {fields.map((field, idx) => (
                  <Flex key={field.id} gap={2} my={6}>
                    <AddressInput
                      control={control}
                      error={
                        (addresses[idx]?.address &&
                          addresses.find(
                            ({ address }, i) =>
                              i < idx && address === addresses[idx]?.address
                          ) &&
                          "You already input this address") ||
                        errors.addresses?.[idx]?.address?.message
                      }
                      helperAction={
                        <AssignMe
                          isDisable={
                            addresses.findIndex(
                              (x) => x.address === walletAddress
                            ) > -1
                          }
                          onClick={() => {
                            track(AmpEvent.USE_ASSIGN_ME);
                            setValue(
                              `addresses.${idx}.address`,
                              walletAddress ?? ("" as BechAddr)
                            );
                            trigger(`addresses.${idx}.address`);
                          }}
                        />
                      }
                      label="Address"
                      name={`addresses.${idx}.address`}
                      variant="fixed-floating"
                    />
                    <Button
                      h="56px"
                      isDisabled={fields.length <= 1}
                      size="lg"
                      variant="outline-gray"
                      w="56px"
                      onClick={() => {
                        remove(idx);
                      }}
                    >
                      <CustomIcon
                        color={fields.length <= 1 ? "gray.600" : "text.dark"}
                        name="delete"
                      />
                    </Button>
                  </Flex>
                ))}
                <Button
                  leftIcon={<CustomIcon color="primary.light" name="plus" />}
                  mt={3}
                  mx="auto"
                  variant="outline-primary"
                  onClick={() => append({ address: "" as BechAddr })}
                >
                  Add more address
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </RadioGroup>
  );
};
