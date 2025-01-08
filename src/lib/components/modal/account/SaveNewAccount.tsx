import type { ButtonProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useEvmConfig,
  useExampleAddresses,
  useMoveConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { useGetMaxLengthError, useHandleAccountSave } from "lib/hooks";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountStore } from "lib/providers/store";
import { useAccountType } from "lib/services/account";
import type { BechAddr } from "lib/types";
import { AccountType } from "lib/types";

import { ToContractButton } from "./ToContractButton";

export interface SaveAccountDetail {
  address: BechAddr;
  description: string;
  name: string;
}

const statusSuccess: FormStatus = {
  message: "Valid Address",
  state: "success",
};

interface SaveNewAccountModalProps {
  accountAddress?: BechAddr;
  buttonProps: ButtonProps;
  publicDescription?: string;
  publicName?: string;
}

export function SaveNewAccountModal({
  accountAddress,
  buttonProps,
  publicDescription,
  publicName,
}: SaveNewAccountModalProps) {
  const { constants } = useCelatoneApp();
  const { user: exampleUserAddress } = useExampleAddresses();
  const { isSomeValidAddress } = useValidateAddress();
  const formatAddresses = useFormatAddresses();
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const evm = useEvmConfig({ shouldRedirect: false });

  const getMaxLengthError = useGetMaxLengthError();
  const { isAccountSaved } = useAccountStore();

  const hasHexAddr = move.enabled || evm.enabled;

  const defaultAddress = accountAddress ?? ("" as BechAddr);
  const defaultValues: SaveAccountDetail = useMemo(() => {
    return {
      address: defaultAddress,
      description: publicDescription ?? "",
      name: publicName ?? "",
    };
  }, [defaultAddress, publicDescription, publicName]);

  const {
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<SaveAccountDetail>({
    defaultValues,
    mode: "all",
  });

  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [isContract, setIsContract] = useState(false);

  const addressState = watch("address");
  const nameState = watch("name");
  const descriptionState = watch("description");
  const resetForm = (resetAddress = true) => {
    reset({
      ...defaultValues,
      address: resetAddress ? defaultAddress : addressState,
    });
  };

  const setErrorStatus = (message: string) => {
    track(AmpEvent.ACCOUNT_FILLED_ERROR, { message });
    setStatus({ message, state: "error" });
  };

  const onSuccess = (type: AccountType) => {
    if (type !== AccountType.ContractAccount) setStatus(statusSuccess);
    else {
      setErrorStatus("You need to save contract through Contract page.");
      setIsContract(true);
    }
  };

  const onError = (err: Error) => {
    resetForm(false);
    setErrorStatus(err.message);
  };

  const { refetch } = useAccountType(addressState, {
    enabled: false,
    onError,
    onSuccess,
  });

  useEffect(() => {
    if (addressState.trim().length === 0) {
      setStatus({
        state: "init",
      });
    } else {
      setStatus({
        state: "loading",
      });
      setIsContract(false);
      const timeoutId = setTimeout(() => {
        if (!isSomeValidAddress(addressState)) {
          setErrorStatus("Invalid Address");
          return;
        }

        if (
          isAccountSaved(addressState) ||
          (hasHexAddr && isAccountSaved(formatAddresses(addressState).address))
        ) {
          setErrorStatus("You already saved this address");
          return;
        }

        if (wasm.enabled) refetch();
        else setStatus(statusSuccess);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [
    addressState,
    formatAddresses,
    hasHexAddr,
    isAccountSaved,
    isSomeValidAddress,
    refetch,
    wasm.enabled,
  ]);

  const handleSave = useHandleAccountSave({
    actions: () => {
      track(AmpEvent.ACCOUNT_SAVE, { isPrefilled: !!accountAddress });
      resetForm();
    },
    address: addressState,
    description: descriptionState,
    name: nameState,
    title: `Saved ${nameState}`,
  });

  return (
    <ActionModal
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      mainBtnTitle="Save New Account"
      title="Save New Account"
      trigger={<Button as="button" {...buttonProps} />}
      buttonRemark="Saved accounts are stored locally on your device."
      icon="bookmark-solid"
      mainAction={handleSave}
      otherAction={resetForm}
      otherBtnTitle="Cancel"
    >
      <Flex gap={6} direction="column">
        <ControllerInput
          isReadOnly={!!accountAddress}
          isRequired
          label="Account Address"
          name="address"
          status={status}
          variant="fixed-floating"
          autoFocus={!accountAddress}
          control={control}
          cursor={accountAddress ? "not-allowed" : "pointer"}
          helperAction={
            isContract && (
              <ToContractButton isAccountPrefilled={!accountAddress} />
            )
          }
          labelBgColor="gray.900"
          placeholder={`ex. ${exampleUserAddress}`}
        />
        <ControllerInput
          label="Account Name"
          name="name"
          rules={{
            maxLength: constants.maxAccountNameLength,
          }}
          variant="fixed-floating"
          autoFocus={!!accountAddress}
          control={control}
          error={
            errors.name && getMaxLengthError(nameState.length, "account_name")
          }
          labelBgColor="gray.900"
          placeholder="ex. Celatone Account 1"
        />
        <ControllerTextarea
          label="Account Description"
          name="description"
          rules={{
            maxLength: constants.maxAccountDescriptionLength,
          }}
          variant="fixed-floating"
          control={control}
          error={
            errors.description &&
            getMaxLengthError(descriptionState.length, "account_desc")
          }
          labelBgColor="gray.900"
          placeholder="Help understanding what this account does ..."
        />
      </Flex>
    </ActionModal>
  );
}
