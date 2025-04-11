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
    closeOnOverlayClick={false}
    isCentered
    isOpen={isOpen}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" py={10} w="414px">
      <ModalHeader py={0} w="full">
        <Stack alignItems="center" gap={4} w="100%">
          <CustomIcon
            boxSize={14}
            color="error.main"
            name="alert-triangle-solid"
          />
          <Heading variant="h5">JSON file is in wrong format</Heading>
        </Stack>
      </ModalHeader>
      <ModalBody overflow="overlay" pt={2}>
        <Text color="text.dark" textAlign="center" variant="body2">
          There is something wrong with your JSON file. So that the rollup is
          cannot be added to Initia Scan.
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
