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

interface EvmContractVerifyFailedModalProps {
  onClose: () => void;
}

export const EvmContractVerifyFailedModal = ({
  onClose,
}: EvmContractVerifyFailedModalProps) => (
  <>
    <ModalHeader py={0} w="full">
      <ModalCloseButton color="gray.600" />
      <Stack alignItems="center" gap={4} w="100%">
        <CustomIcon boxSize={14} color="error.main" name="info-circle" />
        <Heading variant="h5">Verification is unavailable</Heading>
      </Stack>
    </ModalHeader>
    <ModalBody mx="auto" overflow="overlay" pt={2}>
      <Text color="text.dark" textAlign="center" variant="body2">
        There is something wrong with submission. Please try again later.
      </Text>
    </ModalBody>
    <ModalFooter pb={0}>
      <Button variant="outline-primary" w="100%" onClick={onClose}>
        Close
      </Button>
    </ModalFooter>
  </>
);
