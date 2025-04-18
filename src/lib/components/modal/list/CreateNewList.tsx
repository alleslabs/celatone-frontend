import type { ButtonProps } from "@chakra-ui/react";
import type { FormStatus } from "lib/components/forms";
import type { ReactNode } from "react";

import { Box, Button, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useGetMaxLengthError } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { shortenName } from "lib/utils";
import { useCallback, useEffect, useState } from "react";

import { ActionModal } from "../ActionModal";

interface CreateNewListModalProps {
  buttonProps?: ButtonProps;
  trigger?: ReactNode;
  onCreate?: (listName: string) => void;
  onClose?: () => void;
  inputValue?: string;
}

export function CreateNewListModal({
  buttonProps,
  inputValue,
  onClose,
  onCreate,
  trigger,
}: CreateNewListModalProps) {
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();

  const { createNewList, isContractListExist } = useContractStore();

  const [listName, setListName] = useState<string>("");
  const [status, setStatus] = useState<FormStatus>({ state: "init" });

  const resetListName = useCallback(() => {
    setListName(inputValue ?? "");
    onClose?.();
  }, [onClose, inputValue]);

  // TODO: apply useForm
  useEffect(() => {
    const trimedListName = listName.trim();
    if (trimedListName.length === 0) {
      setStatus({ state: "init" });
    } else if (trimedListName.length > constants.maxListNameLength)
      setStatus({
        message: getMaxLengthError(trimedListName.length, "list_name"),
        state: "error",
      });
    else if (isContractListExist(trimedListName))
      setStatus({ message: "Already existed", state: "error" });
    else setStatus({ state: "success" });
  }, [
    constants.maxListNameLength,
    getMaxLengthError,
    isContractListExist,
    listName,
  ]);

  const toast = useToast();
  const handleCreate = useCallback(() => {
    // TODO: check list name and different toast status
    createNewList(listName);
    resetListName();
    onCreate?.(listName);
    onClose?.();

    track(AmpEvent.LIST_CREATE);

    toast({
      duration: 5000,
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: `Create ${shortenName(listName)} successfully`,
    });
  }, [createNewList, listName, resetListName, onCreate, onClose, toast]);

  useEffect(() => {
    if (inputValue !== undefined) setListName(inputValue);
  }, [inputValue]);

  return (
    <ActionModal
      disabledMain={status.state !== "success"}
      icon="add-new"
      mainAction={handleCreate}
      mainBtnTitle="Create"
      otherAction={resetListName}
      otherBtnTitle="Cancel"
      title="Create a new list"
      trigger={trigger || <Button {...buttonProps} as="button" />}
    >
      <Box py={4}>
        <TextInput
          label="List name"
          labelBgColor="gray.900"
          setInputState={setListName}
          status={status}
          value={listName}
          variant="fixed-floating"
        />
      </Box>
    </ActionModal>
  );
}
