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
  setFiles: (files: FileWithPath[]) => void;
  fileType: DropzoneFileType[];
  error?: string;
}

export function DropZone({
  setFiles,
  fileType,
  error,
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
      "application/octet-stream": [],
      "application/json": [],
    };

    const sizes: {
      [key in DropzoneFileType]: number;
    } = {
      json: 10_000_000,
      move: 10_000_000,
      wasm: wasm.enabled ? wasm.storeCodeMaxFileSize : 0,
      mv: move.enabled ? move.moduleMaxFileSize : 0,
      toml: 1_000_000,
      // TODO - Revisit
      vy: 10_000_000,
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

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    multiple: true,
    accept,
    maxSize,
    useFsAccessApi: false,
  });

  const isError =
    Boolean(error || fileRejections.length > 0) && fileType.length === 1;

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
        <input
          {...getInputProps({
            dir: fileType.length > 1 ? "" : undefined,
            webkitdirectory: fileType.length > 1 ? "true" : undefined,
          })}
        />
        <UploadIcon />
        <Flex my={2} gap={1}>
          <Text
            variant="body1"
            color="primary.main"
            transition="all 0.25s ease-in-out"
            _hover={{ color: "primary.light" }}
            style={{ textDecoration: "underline" }}
          >
            Click to upload
          </Text>
          <Text variant="body1">
            {fileType.length > 1
              ? "or drag folder here"
              : `or drag ${selectedConfigs[0].text.rawFileType} file here`}
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
        <Text variant="body3" color="error.main" mt={1}>
          {fileRejections[0]?.errors[0]?.message ?? error}
        </Text>
      )}
    </Flex>
  );
}
