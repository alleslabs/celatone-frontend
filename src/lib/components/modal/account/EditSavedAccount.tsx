import type { AccountLocalInfo } from "lib/stores/account";

import { Flex } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { useGetMaxLengthError, useHandleAccountSave } from "lib/hooks";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import type { SaveAccountDetail } from "./SaveNewAccount";

import { ActionModal } from "../ActionModal";
import { SavedAccountModalHeader } from "./SavedAccountModalHeader";

interface EditSavedAccountModalProps {
  accountLocalInfo: AccountLocalInfo;
  triggerElement: JSX.Element;
}

export const EditSavedAccountModal = ({
  accountLocalInfo,
  triggerElement,
}: EditSavedAccountModalProps) => {
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();
  const defaultValues = useMemo(() => {
    return {
      address: accountLocalInfo.address,
      description: accountLocalInfo.description ?? "",
      name: accountLocalInfo.name ?? "",
    };
  }, [
    accountLocalInfo.address,
    accountLocalInfo.description,
    accountLocalInfo.name,
  ]);

  const {
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<SaveAccountDetail>({
    defaultValues,
    mode: "all",
  });

  const addressState = watch("address");
  const nameState = watch("name");
  const descriptionState = watch("description");

  const resetForm = useCallback(
    () => reset(defaultValues),
    [defaultValues, reset]
  );

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleSave = useHandleAccountSave({
    actions: () => {},
    address: addressState,
    description: descriptionState,
    name: nameState,
    title: `Updated saved account!`,
  });

  return (
    <ActionModal
      closeOnOverlayClick={false}
      disabledMain={!!errors.name || !!errors.description}
      headerContent={
        <SavedAccountModalHeader address={accountLocalInfo.address} />
      }
      icon="edit"
      mainAction={() => {
        track(AmpEvent.ACCOUNT_EDIT);
        handleSave();
      }}
      mainBtnTitle="Save"
      otherAction={resetForm}
      otherBtnTitle="Cancel"
      title="Edit account"
      trigger={triggerElement}
    >
      <Flex direction="column" gap={6}>
        <ControllerInput
          autoFocus
          control={control}
          error={
            errors.name && getMaxLengthError(nameState.length, "account_name")
          }
          label="Account name"
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
          error={
            errors.description &&
            getMaxLengthError(descriptionState.length, "account_desc")
          }
          label="Account description"
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
};
