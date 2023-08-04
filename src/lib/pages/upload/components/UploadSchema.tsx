import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import { useSchemaStore } from "lib/providers/store";
import type { CodeSchema } from "lib/stores/schema";
import type { Option } from "lib/types";

import { UploadMethod } from "./UploadMethod";

interface UploadSchemaContentInterface {
  attached: boolean;
  schema: Option<CodeSchema>;
  codeId: string;
  codeHash: string;
}

const Content = ({
  attached,
  schema,
  codeId,
  codeHash,
}: UploadSchemaContentInterface) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { deleteSchema } = useSchemaStore();
  return (
    <>
      {!attached ? (
        <>
          <Text variant="body2">Attach JSON Schema</Text>
          <Button size="sm" variant="outline-primary" onClick={onOpen}>
            Attach
          </Button>
        </>
      ) : (
        <>
          <Flex align="center" gap={1}>
            <CustomIcon
              name="check-circle-solid"
              color="success.main"
              boxSize={6}
            />
            <Text variant="body2">JSON Schema attached</Text>
          </Flex>
          <Flex align="center">
            <Button
              variant="outline-gray"
              size="sm"
              mr={2}
              onClick={() => {
                const jsonString = JSON.stringify(schema, null, 2);
                const jsonWindow = window.open();
                if (jsonWindow) {
                  // Modify styling later
                  jsonWindow.document.write(
                    `<html><head><title>JSON Schema | Code ID ${codeId}</title>`
                  );

                  // Add styling
                  jsonWindow.document.write(
                    "<style>body { background-color: #f0f0f0; color: #333; }</style>"
                  );

                  jsonWindow.document.write(
                    `</head><body><pre>${jsonString}</pre></body></html>`
                  );
                }
              }}
            >
              View JSON
            </Button>
            <IconButton
              size="sm"
              variant="gray"
              aria-label="edit_schema"
              onClick={onOpen}
              icon={
                <CustomIcon name="edit" color="gray.600" boxSize={4} m={0} />
              }
            />
            <IconButton
              size="sm"
              variant="gray"
              aria-label="delete_schema"
              onClick={() => deleteSchema(codeHash)}
              icon={
                <CustomIcon name="delete" color="gray.600" boxSize={4} m={0} />
              }
            />
          </Flex>
        </>
      )}
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
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
                Please note that the JSON schema you upload on our website will
                only be stored locally on your device. For public projects with
                verified JSON schemas, they will be visible and accessible to
                others.
              </Text>
            </Box>
            <UploadMethod closeDrawer={onClose} codeHash={codeHash} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const UploadSchema = (props: UploadSchemaContentInterface) => {
  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      bg="gray.800"
      justify="space-between"
      align="center"
      p={4}
      w="full"
      borderRadius="4px"
      // eslint-disable-next-line react/destructuring-assignment
      mb={props.attached ? 8 : 0}
    >
      <Content {...props} />
    </Flex>
  );
};
