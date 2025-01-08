import type { ButtonProps } from "@chakra-ui/react";
import { Button, FormControl, useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import { ActionModal } from "../ActionModal";
import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { NumberInput, TextInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { useGetMaxLengthError } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useCodeLcd } from "lib/services/wasm/code";
import type { BechAddr } from "lib/types";
import {
  getNameAndDescriptionDefault,
  getPermissionHelper,
  isId,
} from "lib/utils";

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
        message: getMaxLengthError(trimedName.length, "code_name"),
        state: "error",
      });
    else setNameStatus({ state: "success" });
  }, [constants.maxCodeNameLength, getMaxLengthError, name]);

  /* DEPENDENCY */
  const toast = useToast();
  const { getCodeLocalInfo, isCodeIdSaved, saveNewCode, updateCodeInfo } =
    useCodeStore();

  const { isFetching, isRefetching, refetch } = useCodeLcd(Number(codeId), {
    cacheTime: 0,
    enabled: false,
    onError: () => {
      setCodeIdStatus({ message: "Invalid Code ID", state: "error" });
      setUploader("Not Found");
      setUploaderStatus({ state: "error" });
    },
    onSuccess: (data) => {
      const { message, messageColor } = getPermissionHelper(
        address,
        data.instantiatePermission,
        data.permissionAddresses
      );
      setCodeIdStatus({
        message: `${message} (${data.instantiatePermission})`,
        messageColor,
        state: "success",
      });
      setUploader(data.uploader);
      setUploaderStatus({ state: "success" });
    },
    retry: false,
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
      duration: 5000,
      icon: <CustomIcon name="check-circle-solid" color="success.main" />,
      isClosable: false,
      position: "bottom-right",
      status: "success",
      title: `Saved ${codeId} to Saved Codes`,
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
          message: "You already added this Code ID",
          state: "error",
        });
      } else {
        const timer = setTimeout(() => {
          if (isId(codeId)) refetch();
          else setCodeIdStatus({ message: "Invalid Code ID", state: "error" });
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
      mainBtnTitle="Save New Code"
      title="Save New Code"
      trigger={<Button {...buttonProps} as="button" />}
      icon="bookmark-solid"
      mainAction={handleSave}
      otherAction={reset}
      otherBtnTitle="Cancel"
    >
      <FormControl display="flex" flexDir="column" gap={9}>
        Save other stored codes to your &ldquo;Saved Codes&rdquo; list
        <NumberInput
          label="Code ID"
          status={codeIdStatus}
          value={codeId}
          variant="fixed-floating"
          labelBgColor="gray.900"
          onInputChange={setCodeId}
          placeholder="ex. 1234"
        />
        <TextInput
          isDisabled
          label="Uploader"
          setInputState={() => {}}
          status={uploaderStatus}
          value={uploader}
          variant="fixed-floating"
          labelBgColor="gray.900"
          placeholder="Uploader address will display here"
        />
        <TextInput
          helperText="Fill in code name to define its use as a reminder"
          label="Code Name"
          setInputState={setName}
          status={nameStatus}
          value={name}
          variant="fixed-floating"
          labelBgColor="gray.900"
          placeholder="Untitled Name"
        />
      </FormControl>
    </ActionModal>
  );
}
