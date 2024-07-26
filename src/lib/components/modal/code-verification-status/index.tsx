import {
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import { CustomIcon } from "../../icon";

import { CodeVerificationAlert } from "./CodeVerificationAlert";
import { CodeVerificationInfo } from "./CodeVerificationInfo";
import { CodeVerificationProcess } from "./CodeVerificationProcess";

export const CodeVerificationStatus = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>test</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          w={{ base: "full", md: "645px" }}
          bg="gray.800"
          maxW="100vw"
        >
          <ModalHeader pb={0}>
            <Flex w="full" direction="row" alignItems="center" gap={2}>
              <CustomIcon
                name="verification-solid"
                boxSize={8}
                color="gray.600"
              />
              <Heading variant="h5" as="h5">
                Code Verification Status
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody>
            <CodeVerificationAlert />
            <Flex direction="column" mt={6} gap={4}>
              <CodeVerificationInfo />
              <Divider borderColor="gray.700" />
              <CodeVerificationProcess />
              <Button onClick={onClose} variant="outline-primary" mt={2}>
                Close
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
