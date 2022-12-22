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
} from "@chakra-ui/react";
import { IoList } from "react-icons/io5";

import { useCodeListData } from "lib/pages/codes/data";

import { CodeTableReadOnly } from "./CodeTableReadOnly";

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
            <Text variant="body1" fontWeight={700} ml="24px" mb="24px">
              My Stored Codes
            </Text>
            <CodeTableReadOnly
              onCodeSelect={handleSelect}
              codes={storedCodes}
            />
            <Text variant="body1" fontWeight={700} ml="24px" my="24px">
              Saved Codes
            </Text>
            <CodeTableReadOnly onCodeSelect={handleSelect} codes={savedCodes} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
