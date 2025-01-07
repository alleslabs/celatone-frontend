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
    title: `Updated Saved Account!`,
  });

  return (
    <ActionModal
      disabledMain={!!errors.name || !!errors.description}
      mainBtnTitle="Save"
      title="Edit account"
      trigger={triggerElement}
      closeOnOverlayClick={false}
      headerContent={
        <SavedAccountModalHeader address={accountLocalInfo.address} />
      }
      icon="edit"
      mainAction={() => {
        track(AmpEvent.ACCOUNT_EDIT);
        handleSave();
      }}
      otherAction={resetForm}
      otherBtnTitle="Cancel"
    >
      <Flex gap={6} direction="column">
        <ControllerInput
          label="Account Name"
          name="name"
          rules={{
            maxLength: constants.maxAccountNameLength,
          }}
          variant="fixed-floating"
          autoFocus
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
};
