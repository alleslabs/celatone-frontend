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
      <Flex gap={6} py={4} w="100%" direction="column">
        <Flex alignItems="center" gap={4} direction="column">
          <CustomIcon
            name="check-circle-solid"
            boxSize={12}
            color="success.main"
          />
          <Heading variant="h5">Submitted Verification!</Heading>
          <Text textAlign="center" variant="body2">
            Your code verification request has been submitted.
            <br />
            You can view verification status on code or contract details page.
          </Text>
        </Flex>
        <Button variant="outline-primary" w="100%" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </ModalBody>
  </>
);
