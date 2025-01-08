import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import type { Module, PublishStatus } from "../formConstants";
import { statusResolver } from "../utils";
import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { ComponentLoader } from "lib/components/ComponentLoader";
import { DropZone } from "lib/components/dropzone";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { UploadCard } from "lib/components/upload";
import { useDecodeModule } from "lib/services/move/module";
import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { Option, UpgradePolicy } from "lib/types";

const DEFAULT_TEMP_FILE = {
  base64: "",
  file: undefined,
};

interface UploadModuleCardProps {
  fileState: Module;
  index: number;
  modules: Module[];
  moveEntry: (from: number, to: number) => void;
  policy: UpgradePolicy;
  removeEntry: () => void;
  removeFile: () => void;
  setFile: (
    file: Option<File>,
    base64File: string,
    decodeRes: DecodeModuleQueryResponse,
    publishStatus: PublishStatus
  ) => void;
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
    base64: string;
    file: Option<File>;
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
      gap={4}
      p={4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      flexDirection="column"
    >
      <Flex alignItems="center" w="full" justifyContent="space-between">
        <Heading as="h6" variant="h6" color="text.dark" fontWeight={600}>
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
              <CustomIcon name="arrow-up" color="gray.600" />
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
              <CustomIcon name="arrow-down" color="gray.600" />
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
              <CustomIcon name="close" color="gray.600" />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex w="full" direction="column">
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
              fileType={["mv"]}
              setFiles={(files: File[]) => handleFileDrop(files[0])}
              _hover={undefined}
              bgColor="background.main"
              error={decodeError}
            />
          )}
        </ComponentLoader>
      </Flex>
      <Flex w="full" justifyContent="space-between">
        <Text variant="body2" color="text.dark" fontWeight={600}>
          Module Path
        </Text>
        <Text variant="body2" color="text.dark">
          {decodeRes?.modulePath ?? "-"}
        </Text>
      </Flex>
    </Flex>
  );
};
