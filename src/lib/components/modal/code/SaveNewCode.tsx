import type { ButtonProps } from "@chakra-ui/react";
import type { FormStatus } from "lib/components/forms";
import type { BechAddr } from "lib/types";

import { Button, FormControl, useToast } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import { NumberInput, TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useGetMaxLengthError } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useCodeRest } from "lib/services/wasm/code";
import {
  getNameAndDescriptionDefault,
  getPermissionHelper,
  isId,
} from "lib/utils";
import { useEffect, useMemo, useState } from "react";

import { ActionModal } from "../ActionModal";

interface SaveNewCodeModalProps {
  buttonProps: ButtonProps;
}

export function SaveNewCodeModal({ buttonProps }: SaveNewCodeModalProps) {
  const { address } = useCurrentChain();
  const { constants } = useCelatoneApp();
  const getMaxLengthError = useGetMaxLengthError();

  /* STATE */
  const [codeId, setCodeId] = useState("");
  const [codeIdStatus, setCodeIdStatus] = useState<FormStatus>({
    state: "init",
  });
  const [uploader, setUploader] = useState("");
  const [uploaderStatus, setUploaderStatus] = useState<FormStatus>({
    state: "init",
  });
  const [name, setName] = useState("");
  const [nameStatus, setNameStatus] = useState<FormStatus>({
    state: "init",
  });

  // TODO: apply use-react-form later
  useEffect(() => {
    const trimedName = name.trim();
    if (trimedName.length === 0) {
      setNameStatus({ state: "init" });
    } else if (trimedName.length > constants.maxCodeNameLength)
      setNameStatus({
        state: "error",
        message: getMaxLengthError(trimedName.length, "code_name"),
      });
    else setNameStatus({ state: "success" });
  }, [constants.maxCodeNameLength, getMaxLengthError, name]);

  /* DEPENDENCY */
  const toast = useToast();
  const { isCodeIdSaved, saveNewCode, updateCodeInfo, getCodeLocalInfo } =
    useCodeStore();

  const { refetch, isFetching, isRefetching } = useCodeRest(Number(codeId), {
    enabled: false,
    retry: false,
    cacheTime: 0,
    onSuccess: (data) => {
      const { message, messageColor } = getPermissionHelper(
        address,
        data.instantiatePermission,
        data.permissionAddresses
      );
      setCodeIdStatus({
        state: "success",
        message: `${message} (${data.instantiatePermission})`,
        messageColor,
      });
      setUploader(data.uploader);
      setUploaderStatus({ state: "success" });
    },
    onError: () => {
      setCodeIdStatus({ state: "error", message: "Invalid code ID" });
      setUploader("Not found");
      setUploaderStatus({ state: "error" });
    },
  });

  /* CALLBACK */
  const reset = () => {
    setCodeId("");
    setCodeIdStatus({ state: "init" });
    setUploader("");
    setUploaderStatus({ state: "init" });
    setName("");
  };

  const handleSave = () => {
    track(AmpEvent.CODE_SAVE);
    const id = Number(codeId);

    saveNewCode(id);
    updateCodeInfo(id, uploader as BechAddr, name);

    // TODO: abstract toast to template later
    toast({
      title: `Saved ${codeId} to Saved Codes`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon color="success.main" name="check-circle-solid" />,
    });

    reset();
  };

  /* SIDE EFFECT */
  // update uploader, uploaderStatus
  useEffect(() => {
    if (isFetching || isRefetching) {
      setUploader("Loading");
      setUploaderStatus({ state: "loading" });
    }
  }, [isFetching, isRefetching]);

  // update codeIdStatus
  useEffect(() => {
    if (codeId.trim().length === 0) {
      setCodeIdStatus({ state: "init" });
    } else {
      setCodeIdStatus({ state: "loading" });

      if (isCodeIdSaved(Number(codeId))) {
        setCodeIdStatus({
          state: "error",
          message: "You already added this Code ID",
        });
      } else {
        const timer = setTimeout(() => {
          if (isId(codeId)) refetch();
          else setCodeIdStatus({ state: "error", message: "Invalid code ID" });
        }, 500);

        return () => clearTimeout(timer);
      }
    }

    return () => {};
  }, [isCodeIdSaved, codeId, refetch]);

  // update code name
  useEffect(() => {
    if (codeIdStatus.state === "success") {
      const localName = getNameAndDescriptionDefault(
        getCodeLocalInfo(Number(codeId))?.name
      );
      setName(localName);
    }
  }, [codeId, codeIdStatus.state, getCodeLocalInfo, setName]);

  /* LOGIC */
  // TODO: apply use-react-form later
  const disableMain = useMemo(() => {
    // HACK: check uploader address
    return (
      codeIdStatus.state !== "success" ||
      uploader.length < 20 ||
      nameStatus.state === "error"
    );
  }, [codeIdStatus, uploader, nameStatus]);

  return (
    <ActionModal
      disabledMain={disableMain}
      icon="bookmark-solid"
      mainAction={handleSave}
      mainBtnTitle="Save new code"
      otherAction={reset}
      otherBtnTitle="Cancel"
      title="Save new code"
      trigger={<Button {...buttonProps} as="button" />}
    >
      <FormControl display="flex" flexDir="column" gap={9}>
        Save other stored codes to your &ldquo;Saved Codes&rdquo; list
        <NumberInput
          label="Code ID"
          labelBgColor="gray.900"
          placeholder="ex. 1234"
          status={codeIdStatus}
          value={codeId}
          variant="fixed-floating"
          onInputChange={setCodeId}
        />
        <TextInput
          isDisabled
          label="Uploader"
          labelBgColor="gray.900"
          placeholder="Uploader address will display here"
          setInputState={() => {}}
          status={uploaderStatus}
          value={uploader}
          variant="fixed-floating"
        />
        <TextInput
          helperText="Fill in code name to define its use as a reminder"
          label="Code name"
          labelBgColor="gray.900"
          placeholder="Untitled name"
          setInputState={setName}
          status={nameStatus}
          value={name}
          variant="fixed-floating"
        />
      </FormControl>
    </ActionModal>
  );
}
