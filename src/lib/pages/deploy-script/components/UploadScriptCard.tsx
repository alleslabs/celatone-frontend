import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import type { FileState } from "..";
import { ComponentLoader } from "lib/components/ComponentLoader";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload/UploadCard";
import { useDecodeScript } from "lib/services/move/module";
import type { ExposedFunction, Option } from "lib/types";

const DEFAULT_TEMP_FILE = {
  file: undefined,
  base64: "",
};

interface UploadScriptCardProps {
  fileState: FileState;
  removeFile: () => void;
  setFile: (
    file: Option<File>,
    base64File: string,
    decodeRes: Option<ExposedFunction>
  ) => void;
}

export const UploadScriptCard = ({
  fileState: { file, decodeRes },
  removeFile,
  setFile,
}: UploadScriptCardProps) => {
  const [tempFile, setTempFile] = useState<{
    file: Option<File>;
    base64: string;
  }>(DEFAULT_TEMP_FILE);
  const [decodeError, setDecodeError] = useState("");

  const { isFetching } = useDecodeScript({
    base64EncodedFile: tempFile.base64,
    options: {
      enabled: Boolean(tempFile.base64),
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setFile(tempFile.file, tempFile.base64, data);
        setTempFile(DEFAULT_TEMP_FILE);
        setDecodeError("");
      },
      onError: () => {
        setDecodeError(
          "Failed to decode .mv file. Please make sure the file is a script."
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
      w="full"
    >
      <Flex direction="column">
        <ComponentLoader isLoading={isFetching}>
          {file ? (
            <UploadCard file={file} deleteFile={removeFile} theme="secondary" />
          ) : (
            <DropZone
              setFile={handleFileDrop}
              fileType="mv"
              bgColor="background.main"
              error={decodeError}
              _hover={undefined}
            />
          )}
        </ComponentLoader>
      </Flex>
      <Flex justifyContent="space-between" w="full">
        <Text variant="body2" color="text.dark" fontWeight={600}>
          Function name
        </Text>
        <Text variant="body2" color="text.dark">
          {decodeRes?.name ?? "-"}
        </Text>
      </Flex>
    </Flex>
  );
};
