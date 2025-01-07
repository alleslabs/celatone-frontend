import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";

import { UploadIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";
import { useMoveConfig, useWasmConfig } from "lib/app-provider";
import { big } from "lib/types";

import type { DropzoneConfig, DropzoneFileType } from "./config";
import { DROPZONE_CONFIG } from "./config";

interface DropZoneProps extends FlexProps {
  error?: string;
  fileType: DropzoneFileType[];
  setFiles: (files: FileWithPath[]) => void;
}

export function DropZone({
  error,
  fileType,
  setFiles,
  ...componentProps
}: DropZoneProps) {
  const wasm = useWasmConfig({ shouldRedirect: false });
  const move = useMoveConfig({ shouldRedirect: false });
  const onDrop = useCallback(
    (files: FileWithPath[]) => {
      track(AmpEvent.USE_UPLOAD_FILE, { fileType });
      setFiles(files);
    },
    [fileType, setFiles]
  );

  const { accept, maxSize, selectedConfigs } = useMemo(() => {
    const initialAccept: { [key: string]: string[] } = {
      "application/json": [],
      "application/octet-stream": [],
    };

    const sizes: {
      [key in DropzoneFileType]: number;
    } = {
      move: 10_000_000,
      mv: move.enabled ? move.moduleMaxFileSize : 0,
      schema: 10_000_000,
      toml: 1_000_000,
      wasm: wasm.enabled ? wasm.storeCodeMaxFileSize : 0,
    };

    const selectedSizes: number[] = [];

    const selectedKeyConfigs: DropzoneConfig[] = [];

    fileType.forEach((type) => {
      const config = DROPZONE_CONFIG[type];
      const { accept: typeAccept } = config;
      const [acceptKey, acceptValue] = Object.entries(typeAccept)[0];

      initialAccept[acceptKey] = [...initialAccept[acceptKey], ...acceptValue];

      selectedSizes.push(sizes[type]);

      selectedKeyConfigs.push(config);
    });

    return {
      accept: initialAccept,
      maxSize: Math.max(...selectedSizes),
      selectedConfigs: selectedKeyConfigs,
    };
  }, [fileType, move, wasm]);

  const { fileRejections, getInputProps, getRootProps } = useDropzone({
    accept,
    maxSize,
    multiple: true,
    onDrop,
    useFsAccessApi: false,
  });

  const isError =
    Boolean(error || fileRejections.length > 0) && fileType.length === 1;

  return (
    <Flex direction="column">
      <Flex
        align="center"
        p="24px 16px"
        w="full"
        _hover={{ bg: "gray.900" }}
        border="1px dashed"
        borderColor={isError ? "error.main" : "gray.700"}
        borderRadius="8px"
        cursor="pointer"
        direction="column"
        transition="all 0.25s ease-in-out"
        {...getRootProps()}
        {...componentProps}
      >
        <input
          {...getInputProps({
            dir: fileType.length > 1 ? "" : undefined,
            webkitdirectory: fileType.length > 1 ? "true" : undefined,
          })}
        />
        <UploadIcon />
        <Flex gap={1} my={2}>
          <Text
            style={{ textDecoration: "underline" }}
            variant="body1"
            _hover={{ color: "primary.light" }}
            color="primary.main"
            transition="all 0.25s ease-in-out"
          >
            Click to upload
          </Text>
          <Text variant="body1">
            {fileType.length > 1
              ? "or drag folder here"
              : `or drag ${selectedConfigs[0].text.prettyFileType} file here`}
          </Text>
        </Flex>
        {fileType.length > 1 ? (
          <Text variant="body2" color="text.dark">
            (max. {big(maxSize).div(1_000_000).toPrecision(3)}MB)
          </Text>
        ) : (
          <Text variant="body2" color="text.dark">
            {selectedConfigs[0].text.rawFileType} (max.{" "}
            {selectedConfigs[0].text.rawFileType === ".wasm"
              ? `${maxSize / 1000}KB`
              : `${big(maxSize).div(1_000_000).toPrecision(3)}MB`}
            )
          </Text>
        )}
      </Flex>
      {isError && (
        <Text mt={1} variant="body3" color="error.main">
          {fileRejections[0]?.errors[0]?.message ?? error}
        </Text>
      )}
    </Flex>
  );
}
