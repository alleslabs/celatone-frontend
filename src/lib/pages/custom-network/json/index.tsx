import type { ChainConfig } from "@alleslabs/shared";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import {
  DuplicatedAddCustomMinitiaModal,
  FailedAddCustomMinitiaModal,
  SuccessAddCustomMinitiaModal,
} from "../components";
import { zAddNetworkJsonChainConfigJson } from "../types";
import { useChainConfigs, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useLocalChainConfigStore } from "lib/providers/store";

export const AddNetworkJson = () => {
  const navigate = useInternalNavigate();
  const { isChainIdExist, isPrettyNameExist } = useChainConfigs();
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
      const data: ChainConfig = JSON.parse(reader.result as string);

      const validate = zAddNetworkJsonChainConfigJson.safeParse(data);

      setJson(data);

      if (!validate.success) {
        failedModalOnOpen();

        return;
      }

      if (isChainIdExist(data.chainId) || isPrettyNameExist(data.prettyName)) {
        duplicatedModalOnOpen();

        return;
      }

      addLocalChainConfig(data.chainId, data);
      successModalOnOpen();
    };

    reader.readAsText(file);
  };

  const duplicatedLabel = useCallback(() => {
    if (!json) return "";

    if (isChainIdExist(json.chainId)) return json.chainId;

    if (isPrettyNameExist(json.prettyName)) return json.prettyName;

    return "";
  }, [isChainIdExist, isPrettyNameExist, json]);

  return (
    <>
      <ActionPageContainer>
        <CustomNetworkPageHeader
          title="Add Custom Minitia"
          subtitle="Import JSON"
          hasAlert={false}
        />
        <Flex direction="column" mt={12} gap={6} w="full">
          <CustomNetworkSubheader
            title="Upload your .JSON File"
            subtitle="The uploading JSON file must be in the supported format for InitiaScan only"
          />
          {file ? (
            <UploadCard file={file} deleteFile={() => setFile(null)} />
          ) : (
            <DropZone setFile={setFile} fileType="json" />
          )}
          <Flex justifyContent="space-between" w="full">
            <Button
              variant="outline-secondary"
              onClick={() => navigate({ pathname: "/custom-network/add" })}
              w="140px"
            >
              Cancel
            </Button>
            <Button
              isDisabled={!file}
              variant="primary"
              onClick={handleSubmit}
              w="220px"
            >
              Import new Minitia
            </Button>
          </Flex>
          <Text variant="body2" textAlign="center">
            The added custom Minitia on Initiascan will be stored locally on
            your device.
          </Text>
        </Flex>
      </ActionPageContainer>
      <FailedAddCustomMinitiaModal
        isOpen={isFailedModalOpen}
        onClose={failedModalOnClose}
      />
      <DuplicatedAddCustomMinitiaModal
        isOpen={isDuplicatedModalOpen}
        onClose={duplicatedModalOnClose}
        label={duplicatedLabel()}
      />
      {json && (
        <SuccessAddCustomMinitiaModal
          isOpen={isSuccessModalOpen}
          onClose={successModalOnClose}
          prettyName={json.prettyName}
          chainId={json.chainId}
        />
      )}
    </>
  );
};
