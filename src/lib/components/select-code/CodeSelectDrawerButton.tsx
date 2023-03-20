import {
  Button,
  useDisclosure,
  Text,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { useSavedCodes, useStoredCodes } from "lib/model/code";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { MySavedCodeContent } from "./MySavedCodeContent";
import { MyStoredCodeContent } from "./MyStoredCodeContent";

interface CodeSelectDrawerButtonProps {
  onCodeSelect: (code: string) => void;
  buttonText: string;
}

export const CodeSelectDrawerButton = ({
  onCodeSelect,
  buttonText,
}: CodeSelectDrawerButtonProps) => {
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

      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay />
        <DrawerContent h="80%">
          <DrawerHeader>
            <CustomIcon name="code" boxSize="6" />
            <Heading as="h5" variant="h5">
              Select Code ID
            </Heading>
          </DrawerHeader>
          <DrawerCloseButton color="text.dark" />
          <DrawerBody px={0} overflow="scroll">
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
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
