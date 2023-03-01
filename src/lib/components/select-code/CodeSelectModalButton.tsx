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

import { useSavedCodes, useStoredCodes } from "lib/model/code";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { MySavedCodeContent } from "./MySavedCodeContent";
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
  const { storedCodes } = useStoredCodes();
  const { savedCodes } = useSavedCodes();

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
        onClick={() => {
          AmpTrack(AmpEvent.USE_CODE_MODAL);
          onOpen();
        }}
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
            <Heading as="h6" variant="h6" mb="8px" ml="24px">
              My Stored Codes
            </Heading>
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
            <MySavedCodeContent
              savedCodes={savedCodes}
              handleSelect={handleSelect}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
