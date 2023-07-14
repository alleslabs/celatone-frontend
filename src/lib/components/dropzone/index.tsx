import { Flex, Text } from "@chakra-ui/react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { UploadIcon } from "../icon";
import { useWasmConfig } from "lib/app-provider";

interface DropZoneProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setFile: (file: File) => void;
}

export function DropZone({ setFile, ...componentProps }: DropZoneProps) {
  const wasm = useWasmConfig({ shouldRedirect: false });

  const onDrop = useCallback(
    (file: File[]) => {
      setFile(file[0]);
    },
    [setFile]
  );

  // Throwing error when wasm is disabled will cause the page to not redirect, so default value is assigned instead
  const maxSize = wasm.enabled ? wasm.storeCodeMaxFileSize : 0;

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/wasm": [".wasm"],
    },
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
          <Text variant="body1">or drag Wasm file here</Text>
        </Flex>
        <Text variant="body2" color="text.dark">
          .wasm (max. {maxSize / 1000}KB)
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
