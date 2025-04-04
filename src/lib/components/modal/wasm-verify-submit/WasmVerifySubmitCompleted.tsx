import {
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface WasmVerifySubmitCompletedProps {
  onClose: () => void;
}

export const WasmVerifySubmitCompleted = ({
  onClose,
}: WasmVerifySubmitCompletedProps) => (
  <>
    <ModalCloseButton color="gray.400" />
    <ModalBody overflow="overlay">
      <Flex direction="column" gap={6} w="100%" py={4}>
        <Flex direction="column" gap={4} alignItems="center">
          <CustomIcon
            name="check-circle-solid"
            color="success.main"
            boxSize={12}
          />
          <Heading variant="h5">Submitted verification!</Heading>
          <Text variant="body2" textAlign="center">
            Your code verification request has been submitted.
            <br />
            You can view verification status on code or contract details page.
          </Text>
        </Flex>
        <Button onClick={onClose} variant="outline-primary" w="100%">
          Close
        </Button>
      </Flex>
    </ModalBody>
  </>
);
