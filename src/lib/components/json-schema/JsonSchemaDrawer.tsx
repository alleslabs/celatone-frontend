import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  Flex,
  Heading,
  DrawerCloseButton,
  DrawerBody,
  Text,
  Box,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

import { UploadTemplate } from "./UploadTemplate";

interface JsonSchemaDrawerProps {
  codeId: string;
  codeHash: string;
  isOpen: boolean;
  onClose: () => void;
}

export const JsonSchemaDrawer = ({
  codeId,
  codeHash,
  isOpen,
  onClose,
}: JsonSchemaDrawerProps) => (
  <Drawer
    isOpen={isOpen}
    onClose={onClose}
    placement="bottom"
    returnFocusOnClose={false}
  >
    <DrawerOverlay />
    <DrawerContent h="80%">
      <DrawerHeader>
        <Flex direction="column" gap={2}>
          <Flex align="center" gap={3}>
            <CustomIcon name="upload" boxSize={5} color="gray.600" />
            <Heading as="h5" variant="h5">
              Attach JSON Schema for code ID “{codeId}”
            </Heading>
          </Flex>
          <Text variant="body3" color="text.dark">
            Your attached JSON schema will be stored locally on your device
          </Text>
        </Flex>
      </DrawerHeader>
      <DrawerCloseButton color="gray.600" />
      <DrawerBody overflow="scroll" p={6}>
        <Box
          p="12px 16px"
          borderRadius="8px"
          border="1px solid var(--chakra-colors-gray-700)"
          bg="gray.800"
          mb={6}
        >
          <Text variant="body2" color="text.dark">
            Please note that the JSON schema you upload on our website will only
            be stored locally on your device. For public projects with verified
            JSON schemas, they will be visible and accessible to others.
          </Text>
        </Box>
        <UploadTemplate
          codeHash={codeHash}
          codeId={codeId}
          closeDrawer={onClose}
        />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);
