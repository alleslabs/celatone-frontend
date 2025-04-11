import {
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

interface ModuleVerifyFailedModalProps {
  onClose: () => void;
}

export const ModuleVerifyFailedModal = ({
  onClose,
}: ModuleVerifyFailedModalProps) => (
  <>
    <ModalHeader py={0} w="full">
      <ModalCloseButton color="gray.600" />
      <Stack alignItems="center" gap={4} w="100%">
        <CustomIcon boxSize={14} color="error.main" name="info-circle" />
        <Heading variant="h5">Something went wrong</Heading>
      </Stack>
    </ModalHeader>
    <ModalBody mx="auto" overflow="overlay" pt={2} w="334px">
      <Text color="text.dark" textAlign="center" variant="body2">
        There is something wrong with uploading your folder. Please upload
        again.
      </Text>
    </ModalBody>
    <ModalFooter pb={0}>
      <Button variant="outline-primary" w="100%" onClick={onClose}>
        Close
      </Button>
    </ModalFooter>
  </>
);
