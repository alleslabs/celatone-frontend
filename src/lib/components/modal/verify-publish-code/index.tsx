import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";

import { VerifyPublishCode } from "./verifyPublishCode";
import { VerifyPublishCodeCompleted } from "./verifyPublishCodeCompleted";
import { VerifyPublishCodeFailed } from "./verifyPublishCodeFailed";

interface VerifyPublishCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeId: string;
  codeHash: string;
  contractAddress?: string;
}

enum VerifyState {
  VerifyStatePublishCode = "verifyPublishCode",
  VerifyStatePublishCodeCompleted = "verifyPublishCodeCompleted",
  VerifyStatePublishCodeFailed = "verifyPublishCodeFailed",
}

export const VerifyPublishCodeModal = ({
  isOpen,
  onClose,
  codeId,
  codeHash,
  contractAddress,
}: VerifyPublishCodeModalProps) => {
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
  );
};
