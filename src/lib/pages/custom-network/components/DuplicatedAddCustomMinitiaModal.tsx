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

interface DuplicatedAddCustomMinitiaModalProps {
  isOpen: boolean;
  label: string;
  onClose: () => void;
}

export const DuplicatedAddCustomMinitiaModal = ({
  isOpen,
  label,
  onClose,
}: DuplicatedAddCustomMinitiaModalProps) => (
  <Modal
    isCentered
    isOpen={isOpen}
    closeOnOverlayClick={false}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" py={10} textAlign="center" w="541px">
      <ModalHeader py={0} w="full">
        <Stack alignItems="center" gap={4} w="100%">
          <CustomIcon
            name="alert-triangle-solid"
            boxSize={14}
            color="error.main"
          />
          <Heading variant="h5">{label} is already existed</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody pt={2} overflow="overlay">
        <Text variant="body2" color="text.dark">
          Your JSON file contains the configuration for the added network “
          {label}” which is already existed.
        </Text>
      </ModalBody>
      <ModalFooter pb={0}>
        <Button variant="outline-primary" w="100%" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
