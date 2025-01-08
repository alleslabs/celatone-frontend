import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";

import type { FileState } from "..";
import { ComponentLoader } from "lib/components/ComponentLoader";
import { DropZone } from "lib/components/dropzone";
import { UploadCard } from "lib/components/upload";
import { useDecodeScript } from "lib/services/move/module";
import type { ExposedFunction, Option } from "lib/types";

const DEFAULT_TEMP_FILE = {
  base64: "",
  file: undefined,
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
  fileState: { decodeRes, file },
  removeFile,
  setFile,
}: UploadScriptCardProps) => {
  const [tempFile, setTempFile] = useState<{
    base64: string;
    file: Option<File>;
  }>(DEFAULT_TEMP_FILE);
  const [decodeError, setDecodeError] = useState("");

  const { isFetching } = useDecodeScript({
    base64EncodedFile: tempFile.base64,
    options: {
      enabled: Boolean(tempFile.base64),
      onError: () => {
        setDecodeError(
          "Failed to decode .mv file. Please make sure the file is a script."
        );
        setTempFile(DEFAULT_TEMP_FILE);
      },
      onSuccess: (data) => {
        setFile(tempFile.file, tempFile.base64, data);
        setTempFile(DEFAULT_TEMP_FILE);
        setDecodeError("");
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
      w="full"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      flexDirection="column"
    >
      <Flex direction="column">
        <ComponentLoader isLoading={isFetching}>
          {file ? (
            <UploadCard deleteFile={removeFile} file={file} theme="gray" />
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
          Function name
        </Text>
        <Text variant="body2" color="text.dark">
          {decodeRes?.name ?? "-"}
        </Text>
      </Flex>
    </Flex>
  );
};
