import { Flex, Text } from "@chakra-ui/react";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { UploadIcon } from "../icon/UploadIcon";
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
      borderColor="pebble.700"
      w="full"
      p="24px 16px"
      borderRadius="4px"
      align="center"
      direction="column"
      cursor="pointer"
      {...getRootProps()}
      {...componentProps}
    >
      <input {...getInputProps()} />
      <UploadIcon />
      <Text variant="body1" my="8px">
        <span style={{ color: "#D8BEFC", textDecoration: "underline" }}>
          Click to upload
        </span>{" "}
        or drag Wasm file here
      </Text>
      <Text variant="body2" color="text.dark">
        .wasm (max. 800KB)
      </Text>
    </Flex>
  );
}
