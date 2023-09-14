import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { UploadIcon } from "../icon";
import { useMoveConfig, useWasmConfig } from "lib/app-provider";

import type { DropzoneFileType } from "./config";
import { DROPZONE_CONFIG } from "./config";

interface DropZoneProps extends FlexProps {
  setFile: (file: File) => void;
  fileType: DropzoneFileType;
}

export function DropZone({
  setFile,
  fileType,
  ...componentProps
}: DropZoneProps) {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const onDrop = useCallback(
    (file: File[]) => {
      setFile(file[0]);
    },
    [setFile]
  );

  const config = DROPZONE_CONFIG[fileType];

  // Throwing error when wasm is disabled will cause the page to not redirect, so default value is assigned instead
  const maxSize = (() => {
    if (wasm.enabled) return wasm.storeCodeMaxFileSize;
    return move.enabled ? move.moduleMaxFileSize : 0;
  })();

  // TODO: JSON Schema file size ??
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: config.accept,
    maxSize,
  });

  return (
    <Flex direction="column">
      <Flex
        border="1px dashed"
        borderColor={fileRejections.length > 0 ? "error.main" : "gray.700"}
        w="full"
        p="24px 16px"
        borderRadius="8px"
        align="center"
        direction="column"
        _hover={{ bg: "gray.900" }}
        transition="all .25s ease-in-out"
        cursor="pointer"
        {...getRootProps()}
        {...componentProps}
      >
        <input {...getInputProps()} />
        <UploadIcon />
        <Flex my={2} gap={1}>
          <Text
            variant="body1"
            color="secondary.main"
            transition="all .25s ease-in-out"
            _hover={{ color: "secondary.light" }}
            style={{ textDecoration: "underline" }}
          >
            Click to upload
          </Text>
          <Text variant="body1">
            or drag {config.text.prettyFileType} file here
          </Text>
        </Flex>
        <Text variant="body2" color="text.dark">
          {config.text.rawFileType}{" "}
          {fileType === "wasm" && `(max. ${maxSize / 1000}KB)`}
        </Text>
      </Flex>
      {fileRejections.length > 0 && (
        <Text variant="body3" color="error.main" mt="2px">
          {fileRejections[0].errors[0].message}
        </Text>
      )}
    </Flex>
  );
}
