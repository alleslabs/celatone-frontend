import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

import { useSubmitWasmVerify } from "lib/services/verification/wasm";

import { VerifyPublishCode } from "./verifyPublishCode";
import { VerifyPublishCodeCompleted } from "./verifyPublishCodeCompleted";
import { VerifyPublishCodeFailed } from "./verifyPublishCodeFailed";

interface VerifyPublishCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeId: number;
  codeHash: string;
  contractAddress?: string;
}

const VerifyPublishCodeModalBody = ({
  onClose,
  codeId,
  codeHash,
  contractAddress,
}: Omit<VerifyPublishCodeModalProps, "isOpen">) => {
  const { mutate, isLoading, isSuccess, isError } = useSubmitWasmVerify();

  if (isError) return <VerifyPublishCodeFailed onClose={onClose} />;
  if (isSuccess) return <VerifyPublishCodeCompleted />;
  return (
    <VerifyPublishCode
      codeId={codeId}
      codeHash={codeHash}
      contractAddress={contractAddress}
      onSubmitVerifyPublishCode={mutate}
      isLoading={isLoading}
    />
  );
};

export const VerifyPublishCodeModal = ({
  isOpen,
  onClose,
  ...props
}: VerifyPublishCodeModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent w={{ base: "full", md: "645px" }} bg="gray.800" maxW="100vw">
      <VerifyPublishCodeModalBody onClose={onClose} {...props} />
    </ModalContent>
  </Modal>
);
