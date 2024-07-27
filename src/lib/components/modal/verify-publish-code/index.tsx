import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useState } from "react";

import { VerifyPublishCode } from "./verifyPublishCode";
import { VerifyPublishCodeCompleted } from "./verifyPublishCodeCompleted";
import { VerifyPublishCodeFailed } from "./verifyPublishCodeFailed";

interface VerifyPublishCodeModalProps {
  codeId: string;
  codeHash: string;
  contractAddress?: string;
  triggerElement: ReactNode;
}

enum VerifyState {
  VerifyStatePublishCode = "verifyPublishCode",
  VerifyStatePublishCodeCompleted = "verifyPublishCodeCompleted",
  VerifyStatePublishCodeFailed = "verifyPublishCodeFailed",
}

export const VerifyPublishCodeModal = ({
  codeId,
  codeHash,
  contractAddress,
  triggerElement,
}: VerifyPublishCodeModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [verifyState, setVerifyState] = useState<VerifyState>(
    VerifyState.VerifyStatePublishCode
  );

  const handleOnSubmitVerifyPublishCode = () => {
    setVerifyState(VerifyState.VerifyStatePublishCodeCompleted);
    setTimeout(() => {
      onClose();
      setVerifyState(VerifyState.VerifyStatePublishCode);
    }, 3000);
  };

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
          {verifyState === VerifyState.VerifyStatePublishCode && (
            <VerifyPublishCode
              codeId={codeId}
              codeHash={codeHash}
              contractAddress={contractAddress}
              onSubmitVerifyPublishCode={handleOnSubmitVerifyPublishCode}
            />
          )}
          {verifyState === VerifyState.VerifyStatePublishCodeCompleted && (
            <VerifyPublishCodeCompleted />
          )}
          {verifyState === VerifyState.VerifyStatePublishCodeFailed && (
            <VerifyPublishCodeFailed onClose={onClose} />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
