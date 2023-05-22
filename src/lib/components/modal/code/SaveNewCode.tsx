import type { ButtonProps } from "@chakra-ui/react";
import { Button, useToast, FormControl } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { ActionModal } from "../ActionModal";
import { useLCDEndpoint } from "lib/app-provider";
import type { FormStatus } from "lib/components/forms";
import { TextInput, NumberInput } from "lib/components/forms";
import { CustomIcon } from "lib/components/icon";
import { getMaxCodeNameLengthError, MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore } from "lib/providers/store";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { getCodeIdInfo } from "lib/services/code";
import type { Addr, HumanAddr } from "lib/types";
import { getNameAndDescriptionDefault, getPermissionHelper } from "lib/utils";

interface SaveNewCodeModalProps {
  buttonProps: ButtonProps;
}

export function SaveNewCodeModal({ buttonProps }: SaveNewCodeModalProps) {
  const { address } = useWallet();
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
    } else if (trimedName.length > MAX_CODE_NAME_LENGTH)
      setNameStatus({
        state: "error",
        message: getMaxCodeNameLengthError(trimedName.length),
      });
    else setNameStatus({ state: "success" });
  }, [name]);

  /* DEPENDENCY */
  const toast = useToast();
  const { isCodeIdSaved, saveNewCode, updateCodeInfo, getCodeLocalInfo } =
    useCodeStore();
  const endpoint = useLCDEndpoint();

  const { refetch, isFetching, isRefetching } = useQuery(
    ["query", endpoint, codeId],
    async () => getCodeIdInfo(endpoint, Number(codeId)),
    {
      enabled: false,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const { message, messageColor } = getPermissionHelper(
          address as HumanAddr,
          data.code_info.instantiate_permission.permission,
          data.code_info.instantiate_permission.address
            ? [data.code_info.instantiate_permission.address]
            : data.code_info.instantiate_permission.addresses
        );
        setCodeIdStatus({
          state: "success",
          message: `${message} (${data.code_info.instantiate_permission.permission})`,
          messageColor,
        });
        setUploader(data.code_info.creator);
        setUploaderStatus({ state: "success" });
      },
      onError() {
        setCodeIdStatus({ state: "error", message: "Invalid Code ID" });
        setUploader("Not Found");
        setUploaderStatus({ state: "error" });
      },
    }
  );

  /* CALLBACK */
  const reset = () => {
    setCodeId("");
    setCodeIdStatus({ state: "init" });
    setUploader("");
    setUploaderStatus({ state: "init" });
    setName("");
  };

  const handleSave = () => {
    AmpTrack(AmpEvent.CODE_SAVE);
    const id = Number(codeId);

    saveNewCode(id);
    updateCodeInfo(id, uploader as Addr, name);

    // TODO: abstract toast to template later
    toast({
      title: `Saved ${codeId} to Saved Codes`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: <CustomIcon name="bookmark" />,
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
          refetch();
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
      title="Save New Code"
      icon="bookmark-solid"
      trigger={<Button {...buttonProps} />}
      mainBtnTitle="Save New Code"
      mainAction={handleSave}
      otherAction={reset}
      disabledMain={disableMain}
      otherBtnTitle="Cancel"
      closeOnOverlayClick={false}
    >
      <FormControl display="flex" flexDir="column" gap="36px">
        Save other stored codes to your &ldquo;Saved Codes&rdquo; list
        <NumberInput
          variant="floating"
          value={codeId}
          onInputChange={setCodeId}
          label="Code ID"
          labelBgColor="gray.900"
          status={codeIdStatus}
          placeholder="ex. 1234"
        />
        <TextInput
          variant="floating"
          value={uploader}
          label="Uploader"
          labelBgColor="gray.900"
          placeholder="Uploader address will display here"
          setInputState={() => {}}
          status={uploaderStatus}
          isDisabled
        />
        <TextInput
          variant="floating"
          value={name}
          setInputState={setName}
          label="Code Name"
          labelBgColor="gray.900"
          placeholder="Untitled Name"
          helperText="Fill in code name to define its use as a reminder"
          status={nameStatus}
        />
      </FormControl>
    </ActionModal>
  );
}
