import type { ChainConfig } from "@alleslabs/shared";

import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useChainConfigs, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useLocalChainConfigStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";

import {
  DuplicatedAddCustomMinitiaModal,
  FailedAddCustomMinitiaModal,
  SuccessAddCustomMinitiaModal,
} from "../components";
import { zAddNetworkJsonChainConfigJson } from "../types";

export const AddNetworkJson = observer(() => {
  const navigate = useInternalNavigate();
  const { isChainIdExist } = useChainConfigs();
  const { addLocalChainConfig } = useLocalChainConfigStore();
  const [file, setFile] = useState<File | null>(null);
  const [json, setJson] = useState<ChainConfig | null>(null);

  const {
    isOpen: isFailedModalOpen,
    onClose: failedModalOnClose,
    onOpen: failedModalOnOpen,
  } = useDisclosure();
  const {
    isOpen: isDuplicatedModalOpen,
    onClose: duplicatedModalOnClose,
    onOpen: duplicatedModalOnOpen,
  } = useDisclosure();
  const {
    isOpen: isSuccessModalOpen,
    onClose: successModalOnClose,
    onOpen: successModalOnOpen,
  } = useDisclosure();

  const handleSubmit = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const validate = zAddNetworkJsonChainConfigJson.safeParse(
        JSON.parse(reader.result as string)
      );

      if (!validate.success) {
        failedModalOnOpen();

        return;
      }

      const { data: validatedData } = validate;

      setJson(validatedData);

      if (isChainIdExist(validatedData.chainId)) {
        duplicatedModalOnOpen();

        return;
      }

      addLocalChainConfig(validatedData.chainId, validatedData);
      successModalOnOpen();
    };

    reader.readAsText(file);
  };

  const duplicatedLabel = useCallback(() => {
    if (!json) return "";

    if (isChainIdExist(json.chainId)) return json.chainId;

    return "";
  }, [isChainIdExist, json]);

  return (
    <>
      <ActionPageContainer>
        <CustomNetworkPageHeader
          hasAlert={false}
          subtitle="Import JSON"
          title="Add Custom Rollup"
        />
        <Flex direction="column" gap={6} mt={12} w="full">
          <CustomNetworkSubheader
            subtitle="The uploading JSON file must be in the supported format for InitiaScan only"
            title="Upload your .JSON File"
          />
          {file ? (
            <UploadCard deleteFile={() => setFile(null)} file={file} />
          ) : (
            <DropZone
              fileType={["json"]}
              setFiles={(files: File[]) => setFile(files[0])}
            />
          )}
          <Flex justifyContent="space-between" w="full">
            <Button
              variant="outline-primary"
              w="140px"
              onClick={() => navigate({ pathname: "/custom-network/add" })}
            >
              Cancel
            </Button>
            <Button
              isDisabled={!file}
              variant="primary"
              w="220px"
              onClick={handleSubmit}
            >
              Import new Rollup
            </Button>
          </Flex>
          <Text textAlign="center" variant="body2">
            The added custom Rollup on Initiascan will be stored locally on your
            device.
          </Text>
        </Flex>
      </ActionPageContainer>
      <FailedAddCustomMinitiaModal
        isOpen={isFailedModalOpen}
        onClose={failedModalOnClose}
      />
      <DuplicatedAddCustomMinitiaModal
        isOpen={isDuplicatedModalOpen}
        label={duplicatedLabel()}
        onClose={duplicatedModalOnClose}
      />
      {json && (
        <SuccessAddCustomMinitiaModal
          chainId={json.chainId}
          isOpen={isSuccessModalOpen}
          prettyName={json.prettyName}
          onClose={successModalOnClose}
        />
      )}
    </>
  );
});
