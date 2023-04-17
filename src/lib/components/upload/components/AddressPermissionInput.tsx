import { Button, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";
import type {
  Control,
  FieldArrayWithId,
  FieldPath,
  FieldValues,
  UseFieldArrayRemove,
} from "react-hook-form";
import { useWatch } from "react-hook-form";

import { useCelatoneApp, useValidateAddress } from "lib/app-provider";
import { AssignMe } from "lib/components/AssignMe";
import type { FormStatus, TextInputProps } from "lib/components/forms";
import { ControllerInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Addr, Option } from "lib/types";

interface AddressPermissionInputProps<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "setInputState"> {
  index: number;
  fields: FieldArrayWithId<T>[];
  control: Control<T>;
  addresses: Record<"address", Addr>[];
  remove: UseFieldArrayRemove;
  name: FieldPath<T>;
  setValue: (value: Addr) => void;
}

const getAddressStatus = (input: string, error: Option<string>): FormStatus => {
  if (error) return { state: "error", message: error };
  if (!input) return { state: "init" };
  return { state: "success", message: "Valid Address" };
};

export const AddressPermissionInput = <T extends FieldValues>({
  index,
  control,
  addresses,
  remove,
  name,
  fields,
  error,
  setValue,
}: AddressPermissionInputProps<T>) => {
  const { address: walletAddress } = useWallet();
  const {
    appHumanAddress: { example: exampleHumanAddress },
  } = useCelatoneApp();

  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const validateAddress = useCallback(
    (input: string) =>
      input && !!validateContractAddress(input) && !!validateUserAddress(input)
        ? "Invalid address or not exists."
        : undefined,
    [validateContractAddress, validateUserAddress]
  );

  const watcher = useWatch({
    name,
    control,
  });

  const status = getAddressStatus(watcher, error ?? validateAddress(watcher));

  const containAddress = addresses.some(
    ({ address }) => address === walletAddress
  );

  return (
    <Flex gap={2} my={6} width="100%">
      <ControllerInput
        name={name}
        control={control}
        label="Address"
        status={status}
        placeholder={`ex. ${exampleHumanAddress}`}
        variant="floating"
        error={
          addresses[index]?.address &&
          addresses.find(
            ({ address }, i) =>
              i < index && address === addresses[index]?.address
          ) &&
          "You already input this address"
        }
        helperAction={
          <AssignMe
            onClick={
              walletAddress && !containAddress
                ? () => {
                    AmpTrack(AmpEvent.USE_ASSIGN_ME);
                    setValue(walletAddress as Addr);
                  }
                : undefined
            }
            isDisable={containAddress}
          />
        }
      />
      <Button
        w="56px"
        h="56px"
        variant="outline-gray"
        size="lg"
        disabled={fields.length <= 1}
        onClick={() => remove(index)}
      >
        <CustomIcon
          name="delete"
          color={fields.length <= 1 ? "pebble.600" : "text.dark"}
        />
      </Button>
    </Flex>
  );
};
