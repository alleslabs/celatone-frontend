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
import type { ReactNode } from "react";

import { CustomIcon } from "../../icon";
import type { WasmVerifyInfoBase } from "lib/types";

import { WasmVerifyAlert } from "./WasmVerifyAlert";
import { WasmVerifyProcess } from "./WasmVerifyProcess";
import { WasmVerifyRequestInfo } from "./WasmVerifyRequestInfo";

interface WasmVerifyStatusModalProps {
  codeHash: string;
  relatedVerifiedCodes: number[];
  triggerElement: ReactNode;
  verificationInfo: WasmVerifyInfoBase;
}
export const WasmVerifyStatusModal = ({
  codeHash,
  relatedVerifiedCodes,
  triggerElement,
  verificationInfo,
}: WasmVerifyStatusModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {triggerElement}
      </Flex>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          maxW="100vw"
          w={{ base: "full", md: "645px" }}
        >
          <ModalHeader pb={0}>
            <Flex alignItems="center" gap={2} w="full" direction="row">
              <CustomIcon
                name="verification-solid"
                boxSize={6}
                color="gray.600"
              />
              <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                Code Verification Status
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody p={{ base: 4, md: 6 }}>
            {!verificationInfo.comparedTimestamp && (
              <WasmVerifyAlert errorMsg={verificationInfo.errorMessage} />
            )}
            <Flex gap={4} direction="column">
              <WasmVerifyRequestInfo
                codeHash={codeHash}
                relatedVerifiedCodes={relatedVerifiedCodes}
                verificationInfo={verificationInfo}
              />
              <Divider borderColor="gray.700" />
              <WasmVerifyProcess verificationInfo={verificationInfo} />
              <Button mt={2} variant="outline-primary" onClick={onClose}>
                Close
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
