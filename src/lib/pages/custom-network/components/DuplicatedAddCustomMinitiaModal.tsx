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
  onClose: () => void;
  label: string;
}

export const DuplicatedAddCustomMinitiaModal = ({
  isOpen,
  onClose,
  label,
}: DuplicatedAddCustomMinitiaModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    closeOnOverlayClick={false}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" py={10} w="541px" textAlign="center">
      <ModalHeader w="full" py={0}>
        <Stack alignItems="center" gap={4} w="100%">
          <CustomIcon
            name="alert-circle-solid"
            color="error.main"
            boxSize={14}
          />
          <Heading variant="h5">{label} is already existed</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay" pt={2}>
        <Text variant="body2" color="text.dark">
          Your JSON file contains the configuration for the added network “
          {label}” which is already existed.
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
