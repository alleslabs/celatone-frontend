import type { WasmVerifyInfoBase } from "lib/types";
import type { ReactNode } from "react";

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
import { WasmVerifyAlert } from "./WasmVerifyAlert";
import { WasmVerifyProcess } from "./WasmVerifyProcess";
import { WasmVerifyRequestInfo } from "./WasmVerifyRequestInfo";

interface WasmVerifyStatusModalProps {
  codeHash: string;
  verificationInfo: WasmVerifyInfoBase;
  relatedVerifiedCodes: number[];
  triggerElement: ReactNode;
}
export const WasmVerifyStatusModal = ({
  codeHash,
  verificationInfo,
  relatedVerifiedCodes,
  triggerElement,
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
        returnFocusOnClose={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          maxW="100vw"
          w={{ base: "full", md: "645px" }}
        >
          <ModalHeader pb={0}>
            <Flex alignItems="center" direction="row" gap={2} w="full">
              <CustomIcon
                boxSize={6}
                color="gray.600"
                name="verification-solid"
              />
              <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                Code verification status
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.400" />
          <ModalBody p={{ base: 4, md: 6 }}>
            {!verificationInfo.comparedTimestamp && (
              <WasmVerifyAlert errorMsg={verificationInfo.errorMessage} />
            )}
            <Flex direction="column" gap={4}>
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
