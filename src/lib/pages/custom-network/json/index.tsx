/* eslint-disable sonarjs/cognitive-complexity */
import type { ChainConfig } from "@alleslabs/shared";
import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";

import { useChainConfigs, useInternalNavigate } from "lib/app-provider";
import ActionPageContainer from "lib/components/ActionPageContainer";
import {
  CustomNetworkPageHeader,
  CustomNetworkSubheader,
} from "lib/components/custom-network";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useLocalChainConfigStore } from "lib/providers/store";
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
          title="Add custom rollup"
          subtitle="Import JSON"
          hasAlert={false}
        />
        <Flex direction="column" mt={12} gap={6} w="full">
          <CustomNetworkSubheader
            title="Upload your .JSON file"
            subtitle="The uploading JSON file must be in the supported format for Initia Scan only"
          />
          {file ? (
            <UploadCard file={file} deleteFile={() => setFile(null)} />
          ) : (
            <DropZone
              setFiles={(files: File[]) => setFile(files[0])}
              fileType={["json"]}
            />
          )}
          <Flex justifyContent="space-between" w="full">
            <Button
              variant="outline-primary"
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
              Import new rollup
            </Button>
          </Flex>
          <Text variant="body2" textAlign="center">
            The added custom rollup on Initia Scan will be stored locally on
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
});
