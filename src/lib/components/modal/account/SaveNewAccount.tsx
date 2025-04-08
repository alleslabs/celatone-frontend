import type { ButtonProps } from "@chakra-ui/react";
import type { FormStatus } from "lib/components/forms";
import type { BechAddr } from "lib/types";

import { Button, Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useEvmConfig,
  useExampleAddresses,
  useMoveConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { useGetMaxLengthError, useHandleAccountSave } from "lib/hooks";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountStore } from "lib/providers/store";
import { useAccountType } from "lib/services/account";
import { AccountType } from "lib/types";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import { ToContractButton } from "./ToContractButton";

export interface SaveAccountDetail {
  address: BechAddr;
  name: string;
  description: string;
}

const statusSuccess: FormStatus = {
  state: "success",
  message: "Valid address",
};

interface SaveNewAccountModalProps {
  buttonProps: ButtonProps;
  accountAddress?: BechAddr;
  publicName?: string;
  publicDescription?: string;
}

export function SaveNewAccountModal({
  buttonProps,
  accountAddress,
  publicName,
  publicDescription,
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
      name: publicName ?? "",
      description: publicDescription ?? "",
    };
  }, [defaultAddress, publicDescription, publicName]);

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
    setStatus({ state: "error", message });
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
    onSuccess,
    onError,
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
          setErrorStatus("Invalid address");
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
    title: `Saved ${nameState}`,
    address: addressState,
    name: nameState,
    description: descriptionState,
    actions: () => {
      track(AmpEvent.ACCOUNT_SAVE, { isPrefilled: !!accountAddress });
      resetForm();
    },
  });

  return (
    <ActionModal
      title="Save new account"
      icon="bookmark-solid"
      trigger={<Button as="button" {...buttonProps} />}
      mainBtnTitle="Save new account"
      mainAction={handleSave}
      otherAction={resetForm}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      icon="bookmark-solid"
      mainAction={handleSave}
      mainBtnTitle="Save New Account"
      otherAction={resetForm}
      otherBtnTitle="Cancel"
      title="Save New Account"
      trigger={<Button as="button" {...buttonProps} />}
    >
      <Flex direction="column" gap={6}>
        <ControllerInput
          name="address"
          control={control}
          label="Account address"
          variant="fixed-floating"
          placeholder={`ex. ${exampleUserAddress}`}
          status={status}
          labelBgColor="gray.900"
          isRequired
          autoFocus={!accountAddress}
          control={control}
          cursor={accountAddress ? "not-allowed" : "pointer"}
          helperAction={
            isContract && (
              <ToContractButton isAccountPrefilled={!accountAddress} />
            )
          }
          isReadOnly={!!accountAddress}
          isRequired
          label="Account Address"
          labelBgColor="gray.900"
          name="address"
          placeholder={`ex. ${exampleUserAddress}`}
          status={status}
          variant="fixed-floating"
        />
        <ControllerInput
          autoFocus={!!accountAddress}
          control={control}
          label="Account name"
          variant="fixed-floating"
          placeholder="ex. Scan Account 1"
          labelBgColor="gray.900"
          rules={{
            maxLength: constants.maxAccountNameLength,
          }}
          error={
            errors.name && getMaxLengthError(nameState.length, "account_name")
          }
          label="Account Name"
          labelBgColor="gray.900"
          name="name"
          placeholder="ex. Scan Account 1"
          rules={{
            maxLength: constants.maxAccountNameLength,
          }}
          variant="fixed-floating"
        />
        <ControllerTextarea
          control={control}
          label="Account description"
          placeholder="Help understanding what this account does ..."
          variant="fixed-floating"
          labelBgColor="gray.900"
          rules={{
            maxLength: constants.maxAccountDescriptionLength,
          }}
          error={
            errors.description &&
            getMaxLengthError(descriptionState.length, "account_desc")
          }
          label="Account Description"
          labelBgColor="gray.900"
          name="description"
          placeholder="Help understanding what this account does ..."
          rules={{
            maxLength: constants.maxAccountDescriptionLength,
          }}
          variant="fixed-floating"
        />
      </Flex>
    </ActionModal>
  );
}
