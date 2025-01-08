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
        size="sm"
        variant="ghost-primary"
        w="fit-content"
        onClick={() => {
          trackUseViewJSON(`pool_page_(${modalHeader})`);
          onOpen();
        }}
        rightIcon={<CustomIcon m={0} name="chevron-right" boxSize={3} />}
      >
        View JSON
      </Button>
      <Modal isCentered isOpen={isOpen} size="4xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon name="code" boxSize="6" />
            <Heading as="h5" variant="h5">
              {modalHeader}
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="640px" p={4} overflow="scroll">
            <Box
              bgColor="background.main"
              borderRadius="8px"
              position="relative"
            >
              <JsonReadOnly
                text={jsonPrettify(jsonString)}
                canCopy
                showLines={16}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
