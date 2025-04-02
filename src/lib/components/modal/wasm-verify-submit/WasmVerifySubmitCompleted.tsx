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
      <Flex direction="column" gap={6} py={4} w="100%">
        <Flex alignItems="center" direction="column" gap={4}>
          <CustomIcon
            boxSize={12}
            color="success.main"
            name="check-circle-solid"
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
