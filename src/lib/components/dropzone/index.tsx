import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { UploadIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import { useMoveConfig, useWasmConfig } from "lib/app-provider";
import { big } from "lib/types";

import type { DropzoneFileType } from "./config";
import { DROPZONE_CONFIG } from "./config";

interface DropZoneProps extends FlexProps {
  setFile: (file: File) => void;
  fileType: DropzoneFileType;
  error?: string;
}

export function DropZone({
  setFile,
  fileType,
  error,
  ...componentProps
}: DropZoneProps) {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const onDrop = useCallback(
    (file: File[]) => {
      track(AmpEvent.USE_UPLOAD_FILE, { fileType });
      setFile(file[0]);
    },
    [fileType, setFile]
  );

  const config = DROPZONE_CONFIG[fileType];

  // Throwing error when wasm is disabled will cause the page to not redirect, so default value is assigned instead
  const maxSize = (() => {
    switch (fileType) {
      case "schema":
      case "move":
        return 10_000_000;
      case "wasm":
        return wasm.enabled ? wasm.storeCodeMaxFileSize : 0;
      case "mv":
        return move.enabled ? move.moduleMaxFileSize : 0;
      default:
        return 0;
    }
  })();

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    multiple: false,
    accept: config.accept,
    maxSize,
  });

  const isError = Boolean(error || fileRejections.length > 0);

  return (
    <Flex direction="column">
      <Flex
        border="1px dashed"
        borderColor={isError ? "error.main" : "gray.700"}
        w="full"
        p="24px 16px"
        borderRadius="8px"
        align="center"
        direction="column"
        _hover={{ bg: "gray.900" }}
        transition="all 0.25s ease-in-out"
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
            transition="all 0.25s ease-in-out"
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
          {config.text.rawFileType} (max.{" "}
          {fileType === "wasm"
            ? `${maxSize / 1000}KB`
            : `${big(maxSize).div(1_000_000).toPrecision(3)}MB`}
          )
        </Text>
      </Flex>
      {isError && (
        <Text variant="body3" color="error.main" mt={1}>
          {fileRejections[0]?.errors[0]?.message ?? error}
        </Text>
      )}
    </Flex>
  );
}
