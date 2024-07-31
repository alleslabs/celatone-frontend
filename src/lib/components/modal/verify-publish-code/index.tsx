import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useSubmitWasmVerify } from "lib/services/verification/wasm";

import { VerifyPublishCode } from "./verifyPublishCode";
import { VerifyPublishCodeCompleted } from "./verifyPublishCodeCompleted";
import { VerifyPublishCodeFailed } from "./verifyPublishCodeFailed";

interface VerifyPublishCodeModalProps {
  codeId: number;
  codeHash: string;
  contractAddress?: string;
  triggerElement: ReactNode;
}

interface VerifyPublishCodeModalBodyProps
  extends Omit<VerifyPublishCodeModalProps, "triggerElement"> {
  onClose: () => void;
}

const VerifyPublishCodeModalBody = ({
  codeId,
  codeHash,
  contractAddress,
  onClose,
}: VerifyPublishCodeModalBodyProps) => {
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
  triggerElement,
  ...props
}: VerifyPublishCodeModalProps) => {
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
          <VerifyPublishCodeModalBody {...props} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};
