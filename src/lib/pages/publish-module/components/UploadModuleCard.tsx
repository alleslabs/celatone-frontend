import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { Option, UpgradePolicy } from "lib/types";

import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { ComponentLoader } from "lib/components/ComponentLoader";
import { DropZone } from "lib/components/dropzone";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { UploadCard } from "lib/components/upload";
import { useDecodeModule } from "lib/services/move/module";
import { useCallback, useState } from "react";

import type { Module, PublishStatus } from "../formConstants";

import { statusResolver } from "../utils";

const DEFAULT_TEMP_FILE = {
  base64: "",
  file: undefined,
};

interface UploadModuleCardProps {
  index: number;
  fileState: Module;
  modules: Module[];
  policy: UpgradePolicy;
  setFile: (
    file: Option<File>,
    base64File: string,
    decodeRes: DecodeModuleQueryResponse,
    publishStatus: PublishStatus
  ) => void;
  removeFile: () => void;
  removeEntry: () => void;
  moveEntry: (from: number, to: number) => void;
}

export const UploadModuleCard = ({
  fileState: {
    decodeRes,
    file,
    publishStatus: { status, text },
  },
  index,
  modules,
  moveEntry,
  policy,
  removeEntry,
  removeFile,
  setFile,
}: UploadModuleCardProps) => {
  const [tempFile, setTempFile] = useState<{
    file: Option<File>;
    base64: string;
  }>(DEFAULT_TEMP_FILE);
  const [decodeError, setDecodeError] = useState("");
  const { address } = useCurrentChain();

  const { isFetching } = useDecodeModule({
    base64EncodedFile: tempFile.base64,
    options: {
      enabled: Boolean(tempFile.base64),
      onError: () => {
        setDecodeError(
          "Failed to decode .mv file. Please make sure the file is a module."
        );
        setTempFile(DEFAULT_TEMP_FILE);
      },
      onSuccess: (data) => {
        setFile(
          tempFile.file,
          tempFile.base64,
          data,
          statusResolver({
            address,
            data,
            index,
            modules,
            policy,
          })
        );
        setDecodeError("");
        setTempFile(DEFAULT_TEMP_FILE);
      },
      refetchOnWindowFocus: false,
      retry: 0,
    },
  });

  const handleFileDrop = useCallback(async (target: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      // strip "data:application/octet-stream;base64,oRzrCw..."
      const base64String = dataUrl.replace(/^data:.*;base64,/, "");
      setTempFile({ base64: base64String, file: target });
    };
    reader.readAsDataURL(target);
  }, []);

  return (
    <Flex
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      flexDirection="column"
      gap={4}
      p={4}
    >
      <Flex alignItems="center" justifyContent="space-between" w="full">
        <Heading as="h6" color="text.dark" fontWeight={600} variant="h6">
          Module {index + 1}
        </Heading>
        <Flex
          align="center"
          gap={1}
          visibility={modules.length > 1 ? "visible" : "hidden"}
        >
          <Tooltip label="Move up" variant="primary-light">
            <IconButton
              aria-label="move-up"
              disabled={index === 0}
              size="sm"
              variant="ghost"
              onClick={() => {
                track(AmpEvent.USE_UPLOAD_CARD_MOVE_UP, {
                  currentBoxAmount: modules.length,
                  currentPosition: index + 1,
                  newPosition: index,
                });
                moveEntry(index, index - 1);
              }}
            >
              <CustomIcon color="gray.600" name="arrow-up" />
            </IconButton>
          </Tooltip>
          <Tooltip label="Move down" variant="primary-light">
            <IconButton
              aria-label="move-down"
              disabled={index === modules.length - 1}
              size="sm"
              variant="ghost"
              onClick={() => {
                track(AmpEvent.USE_UPLOAD_CARD_MOVE_DOWN, {
                  currentBoxAmount: modules.length,
                  currentPosition: index + 1,
                  newPosition: index + 2,
                });
                moveEntry(index, index + 1);
              }}
            >
              <CustomIcon color="gray.600" name="arrow-down" />
            </IconButton>
          </Tooltip>
          <Tooltip label="Remove item" variant="primary-light">
            <IconButton
              aria-label="remove"
              size="sm"
              variant="ghost"
              onClick={() => {
                track(AmpEvent.USE_REMOVE_MODULE_UPLOAD_BOX, {
                  currentBoxAmount: modules.length - 1,
                });
                removeEntry();
              }}
            >
              <CustomIcon color="gray.600" name="close" />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex direction="column" w="full">
        <ComponentLoader isLoading={isFetching}>
          {file ? (
            <UploadCard
              deleteFile={removeFile}
              file={file}
              status={status}
              statusText={text}
              theme="gray"
            />
          ) : (
            <DropZone
              _hover={undefined}
              bgColor="background.main"
              error={decodeError}
              fileType={["mv"]}
              setFiles={(files: File[]) => handleFileDrop(files[0])}
            />
          )}
        </ComponentLoader>
      </Flex>
      <Flex justifyContent="space-between" w="full">
        <Text color="text.dark" fontWeight={600} variant="body2">
          Module path
        </Text>
        <Text color="text.dark" variant="body2">
          {decodeRes?.modulePath ?? "-"}
        </Text>
      </Flex>
    </Flex>
  );
};
