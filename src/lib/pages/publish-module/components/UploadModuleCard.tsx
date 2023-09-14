import { Flex, Heading, IconButton, Text } from "@chakra-ui/react";

import { DropZone } from "lib/components/dropzone";
import { CustomIcon } from "lib/components/icon";
import { UploadCard } from "lib/components/upload/UploadCard";
import type { Option } from "lib/types";

interface UploadModuleCardProps {
  index: number;
  file: Option<File>;
  fieldAmount: number;
  setFile: (file: File, modulePath: string) => void;
  removeFile: () => void;
  removeEntry: () => void;
}

export const UploadModuleCard = ({
  index,
  file,
  fieldAmount,
  setFile,
  removeFile,
  removeEntry,
}: UploadModuleCardProps) => {
  return (
    <Flex
      bg="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      p={4}
      gap={4}
      flexDirection="column"
    >
      <Flex justifyContent="space-between" w="full" alignItems="center">
        <Heading as="h6" variant="h6" color="text.dark" fontWeight={600}>
          Module {index + 1}
        </Heading>
        <IconButton
          onClick={removeEntry}
          aria-label="remove"
          variant="ghost"
          size="sm"
          disabled={fieldAmount <= 1}
        >
          <CustomIcon name="close" color="gray.600" />
        </IconButton>
      </Flex>
      {file ? (
        <UploadCard file={file} deleteFile={removeFile} theme="secondary" />
      ) : (
        // TODO: Retrieve module path
        <DropZone
          setFile={(target) => setFile(target, "")}
          fileType="move"
          bgColor="background.main"
          _hover={undefined}
        />
      )}
      <Flex justifyContent="space-between" w="full">
        <Text variant="body2" color="text.dark" fontWeight={600}>
          Module Path
        </Text>
        <Text variant="body2" color="text.dark">
          -
        </Text>
      </Flex>
    </Flex>
  );
};
