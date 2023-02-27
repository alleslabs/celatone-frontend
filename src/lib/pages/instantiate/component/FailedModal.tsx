import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Flex,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { IoIosWarning } from "react-icons/io";

import { CopyButton } from "lib/components/copy";

interface FailedModalProps {
  errorLog: string;
  onClose: () => void;
}

export const FailedModal = ({ errorLog, onClose }: FailedModalProps) => (
  <Modal isOpen onClose={onClose} size="4xl" isCentered>
    <ModalOverlay />
    <ModalContent w="600px">
      <ModalHeader>
        <Flex gap="12px" align="center">
          <Icon as={IoIosWarning} fontSize="24px" color="error.light" />
          <Heading as="h5" variant="h5">
            Failed to instantiate
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        Something went wrong. Here are the error logs.
        <Box bg="background.main" borderRadius="8px" p="8px" mt="16px">
          <Text>{errorLog}</Text>
        </Box>
      </ModalBody>

      <ModalFooter gap="8px">
        <CopyButton value={errorLog} size="md" />
        <Button variant="outline-primary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
