import { Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { useGetMaxLengthError, useHandleAccountSave } from "lib/hooks";
import type { AccountLocalInfo } from "lib/stores/account";

import { SavedAccountModalHeader } from "./SavedAccountModalHeader";
import type { SaveAccountDetail } from "./SaveNewAccount";

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
      name: accountLocalInfo.name ?? "",
      description: accountLocalInfo.description ?? "",
    };
  }, [
    accountLocalInfo.address,
    accountLocalInfo.description,
    accountLocalInfo.name,
  ]);

  const {
    control,
    watch,
    reset,
    formState: { errors },
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
    title: `Updated Saved Account!`,
    address: addressState,
    name: nameState,
    description: descriptionState,
    actions: () => {},
  });

  return (
    <ActionModal
      title="Edit account"
      icon="edit"
      headerContent={
        <SavedAccountModalHeader address={accountLocalInfo.address} />
      }
      trigger={triggerElement}
      mainBtnTitle="Save"
      mainAction={() => {
        track(AmpEvent.ACCOUNT_EDIT);
        handleSave();
      }}
      disabledMain={!!errors.name || !!errors.description}
      otherBtnTitle="Cancel"
      otherAction={resetForm}
      closeOnOverlayClick={false}
    >
      <Flex direction="column" gap={6}>
        <ControllerInput
          name="name"
          control={control}
          label="Account Name"
          variant="fixed-floating"
          placeholder="ex. Scan Account 1"
          labelBgColor="gray.900"
          rules={{
            maxLength: constants.maxAccountNameLength,
          }}
          error={
            errors.name && getMaxLengthError(nameState.length, "account_name")
          }
          autoFocus
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
};
