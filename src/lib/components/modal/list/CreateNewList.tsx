import type { ButtonProps } from "@chakra-ui/react";
import { Box, Button, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useGetMaxLengthError } from "lib/hooks";
import { useContractStore } from "lib/providers/store";
import { shortenName } from "lib/utils";

interface CreateNewListModalProps {
  buttonProps?: ButtonProps;
  inputValue?: string;
  onClose?: () => void;
  onCreate?: (listName: string) => void;
  trigger?: ReactNode;
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
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
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
      mainBtnTitle="Create"
      title="Create a New List"
      trigger={trigger || <Button {...buttonProps} as="button" />}
      icon="add-new"
      mainAction={handleCreate}
      otherAction={resetListName}
      otherBtnTitle="Cancel"
    >
      <Box py={4}>
        <TextInput
          label="List Name"
          setInputState={setListName}
          status={status}
          value={listName}
          variant="fixed-floating"
          labelBgColor="gray.900"
        />
      </Box>
    </ActionModal>
  );
}
