import type { Option } from "lib/types";

import {
  Button,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

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
      <Flex direction="column" gap={6} py={4} w="100%">
        <Flex alignItems="center" direction="column" gap={4}>
          <CustomIcon
            boxSize={12}
            color="error.main"
            name="close-circle-solid"
          />
          <Heading variant="h5">Verification is unavailable</Heading>
          <Text textAlign="center" variant="body2">
            {errorMsg?.endsWith("Similar task is pending")
              ? "This code has already been submitted and is currently undergoing verification. You can check its verification status on the code page."
              : (errorMsg ?? "Something went wrong. Please try again later.")}
          </Text>
        </Flex>
        <Button variant="outline-primary" w="100%" onClick={onClose}>
          Close
        </Button>
      </Flex>
    </ModalBody>
  </>
);
