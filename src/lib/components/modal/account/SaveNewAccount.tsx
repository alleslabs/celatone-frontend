import type { ButtonProps } from "@chakra-ui/react";
import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import {
  useCelatoneApp,
  useExampleAddresses,
  useMoveConfig,
  useTierConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { useGetMaxLengthError, useHandleAccountSave } from "lib/hooks";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useAccountStore } from "lib/providers/store";
import { useAccountType, useAccountTypeLcd } from "lib/services/account";
import type { BechAddr } from "lib/types";
import { AccountType } from "lib/types";

import { ToContractButton } from "./ToContractButton";

export interface SaveAccountDetail {
  address: BechAddr;
  name: string;
  description: string;
}

const statusSuccess: FormStatus = {
  state: "success",
  message: "Valid Address",
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
  const { isFullTier } = useTierConfig();
  const { user: exampleUserAddress } = useExampleAddresses();
  const { isSomeValidAddress } = useValidateAddress();
  const formatAddresses = useFormatAddresses();
  const move = useMoveConfig({ shouldRedirect: false });
  const wasm = useWasmConfig({ shouldRedirect: false });

  const getMaxLengthError = useGetMaxLengthError();
  const { isAccountSaved } = useAccountStore();

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

  const { refetch: refetchLite } = useAccountTypeLcd(addressState, {
    enabled: false,
    onSuccess,
    onError,
  });

  const { refetch: refetchFull } = useAccountType(addressState, {
    enabled: false,
    onSuccess,
    onError,
  });

  const refetch = isFullTier ? refetchFull : refetchLite;

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
          (move.enabled &&
            isAccountSaved(formatAddresses(addressState).address))
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
    isAccountSaved,
    isSomeValidAddress,
    move.enabled,
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
      title="Save New Account"
      icon="bookmark-solid"
      trigger={<Button as="button" {...buttonProps} />}
      mainBtnTitle="Save New Account"
      mainAction={handleSave}
      otherAction={resetForm}
      disabledMain={
        status.state !== "success" || !!errors.name || !!errors.description
      }
      otherBtnTitle="Cancel"
      buttonRemark="Saved accounts are stored locally on your device."
    >
      <Flex direction="column" gap={6}>
        <ControllerInput
          name="address"
          control={control}
          label="Account Address"
          variant="fixed-floating"
          placeholder={`ex. ${exampleUserAddress}`}
          status={status}
          labelBgColor="gray.900"
          isRequired
          autoFocus={!accountAddress}
          isReadOnly={!!accountAddress}
          cursor={accountAddress ? "not-allowed" : "pointer"}
          helperAction={
            isContract && (
              <ToContractButton isAccountPrefilled={!accountAddress} />
            )
          }
        />
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
          autoFocus={!!accountAddress}
        />
        <ControllerTextarea
          name="description"
          control={control}
          label="Account Description"
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
        />
      </Flex>
    </ActionModal>
  );
}
