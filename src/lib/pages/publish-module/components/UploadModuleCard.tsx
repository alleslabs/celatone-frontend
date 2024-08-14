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
import { UploadCard } from "lib/components/upload/UploadCard";
import { useDecodeModule } from "lib/services/move/module";
import type { DecodeModuleQueryResponse } from "lib/services/types";
import type { Option, UpgradePolicy } from "lib/types";

const DEFAULT_TEMP_FILE = {
  file: undefined,
  base64: "",
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
  index,
  fileState: {
    file,
    decodeRes,
    publishStatus: { status, text },
  },
  modules,
  policy,
  setFile,
  removeFile,
  removeEntry,
  moveEntry,
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
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setFile(
          tempFile.file,
          tempFile.base64,
          data,
          statusResolver({
            data,
            modules,
            index,
            policy,
            address,
          })
        );
        setDecodeError("");
        setTempFile(DEFAULT_TEMP_FILE);
      },
      onError: () => {
        setDecodeError(
          "Failed to decode .mv file. Please make sure the file is a module."
        );
        setTempFile(DEFAULT_TEMP_FILE);
      },
    },
  });

  const handleFileDrop = useCallback(async (target: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      // strip "data:application/octet-stream;base64,oRzrCw..."
      const base64String = dataUrl.replace(/^data:.*;base64,/, "");
      setTempFile({ file: target, base64: base64String });
    };
    reader.readAsDataURL(target);
  }, []);

  return (
    <Flex
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      p={4}
      gap={4}
      flexDirection="column"
    >
      <Flex justifyContent="space-between" w="full" alignItems="center">
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
              onClick={() => {
                track(AmpEvent.USE_UPLOAD_CARD_MOVE_UP, {
                  currentPosition: index + 1,
                  newPosition: index,
                  currentBoxAmount: modules.length,
                });
                moveEntry(index, index - 1);
              }}
              aria-label="move-up"
              variant="ghost"
              size="sm"
              disabled={index === 0}
            >
              <CustomIcon name="arrow-up" color="gray.600" />
            </IconButton>
          </Tooltip>
          <Tooltip label="Move down" variant="primary-light">
            <IconButton
              onClick={() => {
                track(AmpEvent.USE_UPLOAD_CARD_MOVE_DOWN, {
                  currentPosition: index + 1,
                  newPosition: index + 2,
                  currentBoxAmount: modules.length,
                });
                moveEntry(index, index + 1);
              }}
              aria-label="move-down"
              variant="ghost"
              size="sm"
              disabled={index === modules.length - 1}
            >
              <CustomIcon name="arrow-down" color="gray.600" />
            </IconButton>
          </Tooltip>
          <Tooltip label="Remove item" variant="primary-light">
            <IconButton
              onClick={() => {
                track(AmpEvent.USE_REMOVE_MODULE_UPLOAD_BOX, {
                  currentBoxAmount: modules.length - 1,
                });
                removeEntry();
              }}
              aria-label="remove"
              variant="ghost"
              size="sm"
            >
              <CustomIcon name="close" color="gray.600" />
            </IconButton>
          </Tooltip>
        </Flex>
      </Flex>
      <Flex direction="column" w="full">
        <ComponentLoader isLoading={isFetching}>
          {file ? (
            <UploadCard
              file={file}
              deleteFile={removeFile}
              theme="gray"
              status={status}
              statusText={text}
            />
          ) : (
            <DropZone
              setFiles={(files: File[]) => handleFileDrop(files[0])}
              fileType={["mv"]}
              bgColor="background.main"
              error={decodeError}
              _hover={undefined}
            />
          )}
        </ComponentLoader>
      </Flex>
      <Flex justifyContent="space-between" w="full">
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
