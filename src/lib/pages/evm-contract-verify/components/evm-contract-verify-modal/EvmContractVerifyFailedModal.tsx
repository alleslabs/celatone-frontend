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
    <ModalHeader w="full" py={0}>
      <ModalCloseButton color="gray.600" />
      <Stack alignItems="center" gap={4} w="100%">
        <CustomIcon name="info-circle" color="error.main" boxSize={14} />
        <Heading variant="h5">Verification is unavailable</Heading>
      </Stack>
    </ModalHeader>
    <ModalBody overflow="overlay" pt={2} mx="auto">
      <Text variant="body2" color="text.dark" textAlign="center">
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
