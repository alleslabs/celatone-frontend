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
import { observer } from "mobx-react-lite";

import { CustomIcon } from "lib/components/icon";

const Content = ({ attached }: { attached: boolean }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            <Button variant="outline-gray" size="sm" mr={2}>
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
              // onClick={() => onClose()}
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
                  Attach JSON Schema for code ID “1”
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
            >
              <Text variant="body2" color="text.dark">
                Please note that the JSON schema you upload on our website will
                only be stored locally on your device. For public projects with
                verified JSON schemas, they will be visible and accessible to
                others.
              </Text>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export const UploadSchema = observer(({ attached }: { attached: boolean }) => {
  // Check attachment state from local storage
  return (
    <Flex
      border="1px solid var(--chakra-colors-gray-700)"
      bg="gray.800"
      justify="space-between"
      align="center"
      p={4}
      w="full"
      borderRadius="4px"
      mb={attached ? 8 : 0}
    >
      <Content attached={attached} />
    </Flex>
  );
});
