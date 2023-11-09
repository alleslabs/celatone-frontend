import type { ButtonProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import {
  useCelatoneApp,
  useExampleAddresses,
  useMoveConfig,
  useValidateAddress,
} from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { useGetMaxLengthError, useHandleAccountSave } from "lib/hooks";
import { useAccountStore } from "lib/providers/store";
import type { Addr } from "lib/types";

import { SavedAccountModalHeader } from "./SavedAccountModalHeader";

export interface SaveAccountDetail {
  address: Addr;
  name: string;
  description: string;
}

interface SaveNewAccountModalProps {
  buttonProps: ButtonProps;
  accountAddress?: Addr;
  publicName?: string;
  publicDescription?: string;
}

export function SaveNewAccountModal({
  buttonProps,
  accountAddress,
  publicName,
  publicDescription,
}: SaveNewAccountModalProps) {
  const { user: exampleUserAddress } = useExampleAddresses();
  const {
    validateUserAddress,
    validateContractAddress,
    validateHexWalletAddress,
    validateHexModuleAddress,
  } = useValidateAddress();
  const { constants } = useCelatoneApp();
  const move = useMoveConfig({ shouldRedirect: false });

  const getMaxLengthError = useGetMaxLengthError();
  const { isAccountSaved } = useAccountStore();

  const defaultValues: SaveAccountDetail = useMemo(() => {
    return {
      address: accountAddress ?? ("" as Addr),
      name: publicName ?? "",
      description: publicDescription ?? "",
    };
  }, [accountAddress, publicName, publicDescription]);

  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<SaveAccountDetail>({
    defaultValues,
    mode: "all",
  });

  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  const addressState = watch("address");
  const nameState = watch("name");
  const descriptionState = watch("description");
  const resetForm = (resetAddress = true) => {
    reset({
      ...defaultValues,
      address: resetAddress ? "" : addressState,
    });
  };

  useEffect(() => {
    if (addressState.trim().length === 0) {
      setStatus({
        state: "init",
      });
    } else {
      setStatus({
        state: "loading",
      });
      if (isAccountSaved(addressState)) {
        setStatus({
          state: "error",
          message: "You already saved this address",
        });
      } else {
        const timeoutId = setTimeout(() => {
          const errUser = validateUserAddress(addressState);
          const errContract = validateContractAddress(addressState);
          const isHex = validateHexWalletAddress(addressState);
          const isHexModule = validateHexModuleAddress(addressState);

          if (
            (!move.enabled && errUser && errContract) ||
            (move.enabled && errUser && errContract && !isHex && !isHexModule)
          )
            setStatus({
              state: "error",
              message: errUser,
            });
          // TODO validate contract type online
          else
            setStatus({
              state: "success",
              message: "Valid Address",
            });
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
    return () => {};
  }, [
    addressState,
    isAccountSaved,
    validateUserAddress,
    validateContractAddress,
    validateHexWalletAddress,
    validateHexModuleAddress,
    move.enabled,
  ]);

  const handleSave = useHandleAccountSave({
    title: `Saved ${nameState}`,
    address: addressState,
    name: nameState,
    description: descriptionState,
    actions: () => {
      resetForm();
    },
  });

  return (
    <ActionModal
      title="Save New Account"
      icon="bookmark-solid"
      trigger={<Button as="button" {...buttonProps} />}
      mainBtnTitle="Save New Account"
      mainAction={handleSave}
      otherAction={resetForm}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      headerContent={
        accountAddress && <SavedAccountModalHeader address={accountAddress} />
      }
      otherBtnTitle="Cancel"
      buttonRemark="Saved accounts are stored locally on your device."
    >
      <Flex direction="column" gap={6}>
        {!accountAddress && (
          <ControllerInput
            name="address"
            control={control}
            label="Account Address"
            variant="fixed-floating"
            placeholder={`ex. ${exampleUserAddress}`}
            status={status}
            labelBgColor="gray.900"
            isRequired
          />
        )}
        <ControllerInput
          name="name"
          control={control}
          label="Account Name"
          variant="fixed-floating"
          placeholder="ex. Celatone Account 1"
          labelBgColor="gray.900"
          rules={{
            maxLength: constants.maxAccountNameLength,
          }}
          error={
            errors.name && getMaxLengthError(nameState.length, "account_name")
          }
        />
        <ControllerTextarea
          name="description"
          control={control}
          label="Account Description"
          placeholder="Help understanding what this account do ..."
          variant="fixed-floating"
          labelBgColor="gray.900"
          rules={{
            maxLength: constants.maxAccountDescriptionLength,
          }}
          error={
            errors.description &&
            getMaxLengthError(descriptionState.length, "account_desc")
          }
        />
      </Flex>
    </ActionModal>
  );
}
