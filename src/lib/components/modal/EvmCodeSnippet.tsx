/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ButtonProps } from "@chakra-ui/react";
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "../icon";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";

interface EvmCodeSnippetProps {
  ml?: ButtonProps["ml"];
}

// TODO: Implement this modal
const EvmCodeSnippet = ({ ml }: EvmCodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return null;

  // return (
  //   <>
  //     <Button
  //       variant="outline-secondary"
  //       minW="128px"
  //       size="sm"
  //       ml={ml}
  //       gap={1}
  //       onClick={() => {
  //         track(AmpEvent.USE_CONTRACT_SNIPPET, {});
  //         onOpen();
  //       }}
  //     >
  //       <CustomIcon name="code" />
  //       Code Snippet
  //     </Button>

  //     <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
  //       <ModalOverlay />
  //       <ModalContent w="840px">
  //         <ModalHeader>
  //           <CustomIcon name="code" boxSize={6} color="gray.600" />
  //           <Heading as="h5" variant="h5">
  //             Code Snippet
  //           </Heading>
  //         </ModalHeader>
  //         <ModalCloseButton color="gray.600" />
  //         <ModalBody px={4} maxH="640px" overflow="scroll">
  //           <Text wordBreak="break-word">
  //             Lorem Ipsum is simply dummy text of the printing and typesetting
  //             industry. Lorem Ipsum has been the industry's standard dummy text
  //             ever since the 1500s, when an unknown printer took a galley of
  //             type and scrambled it to make a type specimen book. It has
  //             survived not only five centuries, but also the leap into
  //             electronic typesetting, remaining essentially unchanged. It was
  //             popularised in the 1960s with the release of Letraset sheets
  //             containing Lorem Ipsum passages, and more recently with desktop
  //             publishing software like Aldus PageMaker including versions of
  //             Lorem Ipsum.
  //           </Text>
  //         </ModalBody>
  //       </ModalContent>
  //     </Modal>
  //   </>
  // );
};

export default EvmCodeSnippet;
