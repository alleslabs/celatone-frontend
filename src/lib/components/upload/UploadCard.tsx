import { Flex, Text } from "@chakra-ui/react";
import big from "big.js";

import { CustomIcon, UploadIcon } from "lib/components/icon";

interface UploadCardProps {
  file: File;
  deleteFile: () => void;
}

export const UploadCard = ({ file, deleteFile }: UploadCardProps) => (
  <Flex
    align="center"
    p="16px"
    gap="16px"
    w="full"
    bgColor="pebble.900"
    borderRadius="8px"
    justifyContent="space-between"
  >
    <Flex gap={5}>
      <UploadIcon />
      <Flex direction="column">
        <Text variant="body1">{file.name}</Text>
        <Text variant="body2" color="text.dark" display="flex" gap="4px">
          {big(file.size).div(1000).toFixed(0)} KB
        </Text>
      </Flex>
    </Flex>
    <CustomIcon
      name="delete"
      color="text.dark"
      onClick={deleteFile}
      cursor="pointer"
    />
  </Flex>
);
