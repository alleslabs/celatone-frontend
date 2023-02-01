import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalCloseButton,
  Text,
  Heading,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { IoList } from "react-icons/io5";

import { EmptyState } from "lib/components/state/EmptyState";
import { useCodeListData } from "lib/pages/codes/data";

import { CodeTableReadOnly } from "./CodeTableReadOnly";
import { MyStoredCodeContent } from "./MyStoredCodeContent";

interface CodeSelectModalButtonProps {
  onCodeSelect: (code: string) => void;
  buttonText: string;
}

export const CodeSelectModalButton = ({
  onCodeSelect,
  buttonText,
}: CodeSelectModalButtonProps) => {
  // ------------------------------------------//
  // ---------------DEPENDENCIES---------------//
  // ------------------------------------------//
  const { storedCodes, savedCodes } = useCodeListData();

  // ------------------------------------------//
  // ------------------STATES------------------//
  // ------------------------------------------//
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleSelect = (code: string) => {
    onCodeSelect(code);
    onClose();
  };

  return (
    <>
      <Button
        variant="outline-primary"
        size="md"
        ml="auto"
        w="120px"
        onClick={onOpen}
      >
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <Icon as={IoList} color="text.dark" fontSize="24px" />
            <Heading as="h5" variant="h5">
              Select Code ID
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="text.dark" />
          <ModalBody px={0} maxH="640px" overflow="scroll">
            <Text variant="body1" fontWeight={700} ml="24px" mb="16px">
              My Stored Codes
            </Text>
            <MyStoredCodeContent
              storedCodes={storedCodes}
              handleSelect={handleSelect}
            />
            <Text
              variant="body1"
              fontWeight={700}
              ml="24px"
              mt="24px"
              mb="16px"
            >
              Saved Codes
            </Text>
            {savedCodes.length ? (
              <CodeTableReadOnly
                onCodeSelect={handleSelect}
                codes={savedCodes}
              />
            ) : (
              <Flex
                py="64px"
                direction="column"
                borderY="1px solid"
                borderColor="divider.main"
              >
                <EmptyState message="You don’t have any saved codes in this device." />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
