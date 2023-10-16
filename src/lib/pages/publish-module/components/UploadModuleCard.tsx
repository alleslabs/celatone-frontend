import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import type {
  FileArrayFields,
  FileField,
  PublishStatus,
} from "../formConstants";
import { statusResolver } from "../utils";
import { useCurrentChain } from "lib/app-provider";
import { ComponentLoader } from "lib/components/ComponentLoader";
import { DropZone } from "lib/components/dropzone";
import { CustomIcon } from "lib/components/icon";
import { UploadCard } from "lib/components/upload/UploadCard";
import {
  type DecodeModuleQueryResponse,
  useDecodeModule,
} from "lib/services/move/moduleService";
import type { HumanAddr, UpgradePolicy, Option } from "lib/types";

const DEFAULT_TEMP_FILE = {
  file: undefined,
  base64: "",
};

interface UploadModuleCardProps {
  index: number;
  fileState: FileField;
  fields: FileArrayFields;
  policy: UpgradePolicy;
  setFile: (
    file: Option<File>,
    base64File: string,
    decodeRes: DecodeModuleQueryResponse,
    publishStatus: PublishStatus
  ) => void;
  removeFile: () => void;
  removeEntry: () => void;
}

export const UploadModuleCard = ({
  index,
  fileState: {
    file,
    decodeRes,
    publishStatus: { status, text },
  },
  fields,
  policy,
  setFile,
  removeFile,
  removeEntry,
}: UploadModuleCardProps) => {
  const [tempFile, setTempFile] = useState<{
    file: Option<File>;
    base64: string;
  }>(DEFAULT_TEMP_FILE);
  const { address } = useCurrentChain();

  const { isFetching } = useDecodeModule({
    base64EncodedFile: tempFile.base64,
    address: address as HumanAddr,
    options: {
      enabled: Boolean(tempFile.base64),
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setFile(
          tempFile.file,
          tempFile.base64,
          data,
          statusResolver({ data, fields, index, policy })
        );
        setTempFile(DEFAULT_TEMP_FILE);
      },
      onError: () => setTempFile(DEFAULT_TEMP_FILE),
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
        <IconButton
          onClick={removeEntry}
          aria-label="remove"
          variant="ghost"
          size="sm"
          visibility={fields.length > 1 ? "visible" : "hidden"}
        >
          <CustomIcon name="close" color="gray.600" />
        </IconButton>
      </Flex>
      <Flex direction="column" w="full">
        <ComponentLoader isLoading={isFetching}>
          {file ? (
            <UploadCard
              file={file}
              deleteFile={removeFile}
              theme="secondary"
              status={status}
              statusText={text}
            />
          ) : (
            <DropZone
              setFile={handleFileDrop}
              fileType="move"
              bgColor="background.main"
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
