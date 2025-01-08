import {
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";
import type { Option } from "lib/types";

interface WasmVerifySubmitFailedProps {
  errorMsg: Option<string>;
  onClose: () => void;
}

export const WasmVerifySubmitFailed = ({
  errorMsg,
  onClose,
}: WasmVerifySubmitFailedProps) => (
  <>
    <ModalCloseButton color="gray.400" />
    <ModalBody overflow="overlay">
      <Flex gap={6} py={4} w="100%" direction="column">
        <Flex alignItems="center" gap={4} direction="column">
          <CustomIcon
            name="close-circle-solid"
            boxSize={12}
            color="error.main"
          />
          <Heading variant="h5">Verification is unavailable</Heading>
          <Text textAlign="center" variant="body2">
            {errorMsg?.endsWith("Similar task is pending")
              ? "This code has already been submitted and is currently undergoing verification. You can check its verification status on the code page."
              : errorMsg ?? "Something went wrong. Please try again later."}
          </Text>
        </Flex>
        <Button variant="outline-primary" w="100%" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </ModalBody>
  </>
);
