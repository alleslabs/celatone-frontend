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
    <ModalHeader w="full" py={0}>
      <ModalCloseButton color="gray.600" />
      <Stack alignItems="center" gap={4} w="100%">
        <CustomIcon name="alert-circle-solid" color="error.main" boxSize={14} />
        <Heading variant="h5">Something went wrong</Heading>
      </Stack>
    </ModalHeader>
    <ModalBody overflow="overlay" pt={2} w="334px" mx="auto">
      <Text variant="body2" color="text.dark" textAlign="center">
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
