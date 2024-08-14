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
      <Flex direction="column" gap={6} w="100%" px={6} py={8}>
        <Flex direction="column" gap={4} alignItems="center">
          <CustomIcon
            name="close-circle-solid"
            color="error.main"
            boxSize={12}
          />
          <Heading variant="h5">Verification is unavailable</Heading>
          <Text variant="body2" textAlign="center">
            {errorMsg?.endsWith("Similar task is pending")
              ? "This code has already been submitted and is currently undergoing verification. You can check its verification status on the code page."
              : errorMsg ?? "Something went wrong. Please try again later."}
          </Text>
        </Flex>
        <Button onClick={onClose} variant="outline-primary" w="100%">
          Close
        </Button>
      </Flex>
    </ModalBody>
  </>
);
