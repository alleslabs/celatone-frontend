import type { ButtonProps } from "@chakra-ui/react";
import { Button, Icon, useToast, FormControl } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { MdBookmark, MdCheckCircle } from "react-icons/md";

import type { FormStatus } from "lib/components/forms";
import { TextInput, NumberInput } from "lib/components/forms";
import { ActionModal } from "lib/components/modal/ActionModal";
import {
  getMaxCodeDescriptionLengthError,
  MAX_CODE_DESCRIPTION_LENGTH,
} from "lib/data";
import { useCodeStore, useLCDEndpoint } from "lib/hooks";
import { getCodeIdInfo } from "lib/services/code";
import { getDescriptionDefault } from "lib/utils";

interface ModalProps {
  buttonProps: ButtonProps;
}

export function SaveNewCodeModal({ buttonProps }: ModalProps) {
  /* STATE */
  const [codeId, setCodeId] = useState("");
  const [codeIdStatus, setCodeIdStatus] = useState<FormStatus>({
    state: "init",
  });
  const [uploader, setUploader] = useState("");
  const [uploaderStatus, setUploaderStatus] = useState<FormStatus>({
    state: "init",
  });
  const [description, setDescription] = useState("");
  const [descriptionStatus, setDescriptionStatus] = useState<FormStatus>({
    state: "init",
  });

  // TODO: apply use-react-form later
  useEffect(() => {
    const trimedDescription = description.trim();
    if (trimedDescription.length === 0) {
      setDescriptionStatus({ state: "init" });
    } else if (trimedDescription.length > MAX_CODE_DESCRIPTION_LENGTH)
      setDescriptionStatus({
        state: "error",
        message: getMaxCodeDescriptionLengthError(trimedDescription.length),
      });
    else setDescriptionStatus({ state: "success" });
  }, [description]);

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
        setCodeIdStatus({ state: "success", message: "Valid Code ID" });
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
    setDescription("");
  };

  const handleSave = () => {
    const id = Number(codeId);

    saveNewCode(id);
    updateCodeInfo(id, uploader, description);

    // TODO: abstract toast to template later
    toast({
      title: `Saved ${codeId} to Saved Codes`,
      status: "success",
      duration: 5000,
      isClosable: false,
      position: "bottom-right",
      icon: (
        <Icon
          as={MdCheckCircle}
          color="success.main"
          boxSize="6"
          display="flex"
          alignItems="center"
        />
      ),
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

  // update code description
  useEffect(() => {
    if (codeIdStatus.state === "success") {
      const localDescription = getDescriptionDefault(
        getCodeLocalInfo(Number(codeId))?.description
      );
      setDescription(localDescription);
    }
  }, [codeId, codeIdStatus.state, getCodeLocalInfo, setDescription]);

  /* LOGIC */
  // TODO: apply use-react-form later
  const disableMain = useMemo(() => {
    // HACK: check uploader address
    return (
      codeIdStatus.state !== "success" ||
      uploader.length < 20 ||
      descriptionStatus.state === "error"
    );
  }, [codeIdStatus, uploader, descriptionStatus]);

  return (
    <ActionModal
      title="Save New Code"
      icon={MdBookmark}
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
          labelBgColor="gray.800"
          status={codeIdStatus}
          placeholder="ex. 1234"
        />
        <TextInput
          value={uploader}
          label="Uploader"
          labelBgColor="gray.800"
          placeholder="Uploader address will display here"
          setInputState={() => {}}
          status={uploaderStatus}
          isDisabled
        />
        <TextInput
          variant="floating"
          value={description}
          setInputState={setDescription}
          label="Code Description"
          labelBgColor="gray.800"
          placeholder="No Description"
          helperText="Fill in code description to define its use as a reminder"
          status={descriptionStatus}
        />
      </FormControl>
    </ActionModal>
  );
}
