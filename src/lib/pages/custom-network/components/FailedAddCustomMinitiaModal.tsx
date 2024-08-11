import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface FailedAddCustomMinitiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FailedAddCustomMinitiaModal = ({
  isOpen,
  onClose,
}: FailedAddCustomMinitiaModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    closeOnOverlayClick={false}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" py={10} w="414px">
      <ModalHeader w="full" py={0}>
        <Stack alignItems="center" gap={4} w="100%">
          <CustomIcon
            name="alert-circle-solid"
            color="error.main"
            boxSize={14}
          />
          <Heading variant="h5">JSON file is in wrong format</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay" pt={2}>
        <Text variant="body2" color="text.dark" textAlign="center">
          There is something wrong with your JSON file. So that the Minitia is
          cannot be added to InitiaScan.
        </Text>
      </ModalBody>
      <ModalFooter pb={0}>
        <Button variant="outline-secondary" w="100%" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
