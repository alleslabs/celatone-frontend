import { Flex, Text } from "@chakra-ui/react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { UploadIcon } from "../icon";
import { MAX_FILE_SIZE } from "lib/data";

interface DropZoneProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  setFile: (file: File) => void;
}

export function DropZone({ setFile, ...componentProps }: DropZoneProps) {
  const onDrop = useCallback(
    (file: File[]) => {
      setFile(file[0]);
    },
    [setFile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/wasm": [".wasm"],
    },
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <Flex
      border="1px dashed"
      borderColor="gray.700"
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
      <Flex my="8px" gap="4px">
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
        .wasm (max. 800KB)
      </Text>
    </Flex>
  );
}
