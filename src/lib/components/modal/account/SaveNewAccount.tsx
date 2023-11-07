import type { ButtonProps } from "@chakra-ui/react";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionModal } from "../ActionModal";
import {
  useCelatoneApp,
  useExampleAddresses,
  useValidateAddress,
} from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { ControllerInput, ControllerTextarea } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useGetMaxLengthError } from "lib/hooks";
import type { HumanAddr } from "lib/types";

interface SaveNewAccountDetail {
  address: HumanAddr;
  name: string;
  description: string;
}
interface SaveNewAccountModalProps {
  buttonProps: ButtonProps;
}

export function SaveNewAccountModal({ buttonProps }: SaveNewAccountModalProps) {
  const toast = useToast();
  const { user: exampleUserAddress } = useExampleAddresses();
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();

  const defaultValues: SaveNewAccountDetail = {
    address: "" as HumanAddr,
    name: "",
    description: "",
  };

  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<SaveNewAccountDetail>({
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
      const timeoutId = setTimeout(() => {
        const errUser = validateUserAddress(addressState);
        const errContract = validateContractAddress(addressState);
        if (errUser && errContract)
          setStatus({
            state: "error",
            message: errUser,
          });
        else
          setStatus({
            state: "success",
            message: "Valid Address",
          });
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [addressState, validateUserAddress, validateContractAddress]);

  const handleSave = () => {
    // TODO: abstract toast to template later
    toast({
      title: `Saved .. to Saved Codes`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="bookmark" />,
    });
  };

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
      {/* Save other stored codes to your &ldquo;Saved Codes&rdquo; list */}
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
        />
        <ControllerInput
          name="name"
          control={control}
          label="Account Name"
          variant="fixed-floating"
          placeholder="ex. Celatone Account 1"
          labelBgColor="gray.900"
          isRequired
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
            getMaxLengthError(descriptionState.length, "contract_desc")
          }
        />
      </Flex>
    </ActionModal>
  );
}
