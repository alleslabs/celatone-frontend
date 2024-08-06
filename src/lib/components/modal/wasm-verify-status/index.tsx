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
                boxSize={6}
                color="gray.600"
              />
              <Heading variant={{ base: "h6", md: "h5" }} as="h5">
                Code Verification Status
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
                verificationInfo={verificationInfo}
                relatedVerifiedCodes={relatedVerifiedCodes}
              />
              <Divider borderColor="gray.700" />
              <WasmVerifyProcess verificationInfo={verificationInfo} />
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
