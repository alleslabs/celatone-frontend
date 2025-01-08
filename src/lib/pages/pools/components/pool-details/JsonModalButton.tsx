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
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        w="fit-content"
        height="24px"
        p="4px"
        size="sm"
        variant="ghost-primary"
        rightIcon={<CustomIcon name="chevron-right" boxSize={3} m={0} />}
        onClick={() => {
          trackUseViewJSON(`pool_page_(${modalHeader})`);
          onOpen();
        }}
      >
        View JSON
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <CustomIcon name="code" boxSize="6" />
            <Heading as="h5" variant="h5">
              {modalHeader}
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody p={4} maxH="640px" overflow="scroll">
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
