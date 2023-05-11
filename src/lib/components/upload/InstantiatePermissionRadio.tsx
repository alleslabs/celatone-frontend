import { Text, Box, Radio, RadioGroup, Button, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";
import type { Control, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { useController, useFieldArray, useWatch } from "react-hook-form";

import { AddressInput } from "../AddressInput";
import { AssignMe } from "../AssignMe";
import { CustomIcon } from "lib/components/icon";
import {
  AmpEvent,
  AmpTrack,
  AmpTrackUseInstantiatePermission,
} from "lib/services/amplitude";
import type { Addr, UploadSectionState } from "lib/types";
import { AccessType } from "lib/types";

interface InstantiatePermissionRadioProps {
  control: Control<UploadSectionState>;
  setValue: UseFormSetValue<UploadSectionState>;
  trigger: UseFormTrigger<UploadSectionState>;
  page?: string;
}

interface PermissionRadioProps {
  isSelected: boolean;
  value: AccessType;
  text: string;
}

const PermissionRadio = ({ isSelected, value, text }: PermissionRadioProps) => (
  <Radio value={value} py={2} width="100%" size="lg">
    <Text fontWeight={isSelected ? "600" : "400"}>{text} </Text>
  </Radio>
);

export const InstantiatePermissionRadio = ({
  control,
  setValue,
  trigger,
  page,
}: InstantiatePermissionRadioProps) => {
  const { address: walletAddress } = useWallet();

  const { fields, append, remove } = useFieldArray({
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
    if (page)
      AmpTrackUseInstantiatePermission(
        page,
        permission,
        emptyAddressesLength,
        addresses.length - emptyAddressesLength
      );
  }, [addresses, page, permission]);

  return (
    <RadioGroup
      name="instantiatePermission"
      onChange={(nextValue: string) => {
        const value = parseInt(nextValue, 10);
        setValue("permission", value);
      }}
      value={permission}
    >
      <Box>
        <PermissionRadio
          isSelected={permission === AccessType.ACCESS_TYPE_EVERYBODY}
          value={AccessType.ACCESS_TYPE_EVERYBODY}
          text="Anyone can instantiate (Everybody)"
        />
        <PermissionRadio
          isSelected={permission === AccessType.ACCESS_TYPE_NOBODY}
          value={AccessType.ACCESS_TYPE_NOBODY}
          text="Instantiate through governance only (Nobody)"
        />
        <Box>
          <PermissionRadio
            isSelected={permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}
            value={AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES}
            text="Only a set of addresses can instantiate (AnyOfAddresses)"
          />
          {permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES && (
            <Box>
              {fields.map((field, idx) => (
                <Flex gap={2} my={6} key={field.id}>
                  <AddressInput
                    name={`addresses.${idx}.address`}
                    control={control}
                    label="Address"
                    variant="floating"
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
                        onClick={() => {
                          AmpTrack(AmpEvent.USE_ASSIGN_ME);
                          setValue(
                            `addresses.${idx}.address`,
                            walletAddress as Addr
                          );
                          trigger(`addresses.${idx}.address`);
                        }}
                        isDisable={
                          addresses.findIndex(
                            (x) => x.address === walletAddress
                          ) > -1
                        }
                      />
                    }
                  />
                  <Button
                    w="56px"
                    h="56px"
                    variant="outline-gray"
                    size="lg"
                    disabled={fields.length <= 1}
                    onClick={() => remove(idx)}
                  >
                    <CustomIcon
                      name="delete"
                      color={fields.length <= 1 ? "pebble.600" : "text.dark"}
                    />
                  </Button>
                </Flex>
              ))}
              <Button
                variant="outline-primary"
                mt={3}
                mx="auto"
                onClick={() => append({ address: "" as Addr })}
                leftIcon={<CustomIcon name="plus" color="violet.light" />}
              >
                Add More Address
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </RadioGroup>
  );
};
