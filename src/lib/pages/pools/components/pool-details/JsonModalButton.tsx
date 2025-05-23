import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { trackUseViewJSON } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import JsonReadOnly from "lib/components/json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

interface JsonModalButtonProps {
  jsonString: string;
  modalHeader: string;
}

export const JsonModalButton = ({
  jsonString,
  modalHeader,
}: JsonModalButtonProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button
        height="24px"
        p="4px"
        rightIcon={<CustomIcon boxSize={3} m={0} name="chevron-right" />}
        size="sm"
        variant="ghost-primary"
        w="fit-content"
        onClick={() => {
          trackUseViewJSON(`pool_page_(${modalHeader})`);
          onOpen();
        }}
      >
        View JSON
      </Button>
      <Modal isCentered isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon boxSize="6" name="code" />
            <Heading as="h5" variant="h5">
              {modalHeader}
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="640px" overflow="scroll" p={4}>
            <Box
              bgColor="background.main"
              borderRadius="8px"
              position="relative"
            >
              <JsonReadOnly
                canCopy
                showLines={16}
                text={jsonPrettify(jsonString)}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
