import {
  Alert,
  AlertDescription,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { DropZone } from "lib/components/dropzone";
import { CustomIcon } from "lib/components/icon";

export const ModuleVerifyUploadFolder = () => (
  <Stack gap={4}>
    <Stack gap={2}>
      <Heading as="h6" variant="h6">
        Upload Project Folder
      </Heading>
      <Text variant="body2" color="text.dark">
        Select a folder to upload files in order to verify the modules
      </Text>
    </Stack>
    <Alert variant="accent" gap={4} alignItems="flex-start">
      <CustomIcon name="alert-circle-solid" color="accent.main" boxSize={4} />
      <AlertDescription>
        {`If the verification module requires calling functions from other
        modules, please ensure that the corresponding \u201C.move\u201D files are
        uploaded to complete the process.`}
      </AlertDescription>
    </Alert>
    <Stack gap={2}>
      <DropZone fileType="move" setFile={() => null} />
      <Flex alignItems="center" gap={1}>
        <CustomIcon
          name="check-circle-solid"
          boxSize={4}
          color="text.disabled"
        />
        <Text variant="body2">{`\u201C.move\u201D files are required`}</Text>
      </Flex>
      <Flex alignItems="center" gap={1}>
        <CustomIcon
          name="check-circle-solid"
          boxSize={4}
          color="text.disabled"
        />
        <Text variant="body2">{`\u201CMove.toml\u201D file are required`}</Text>
      </Flex>
    </Stack>
  </Stack>
);
