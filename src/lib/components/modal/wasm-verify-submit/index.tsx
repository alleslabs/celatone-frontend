import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import type { MouseEvent, ReactNode } from "react";

import { useSubmitWasmVerify } from "lib/services/verification/wasm";
import type { BechAddr32, WasmVerifyStatus } from "lib/types";

import { WasmVerifySubmitCompleted } from "./WasmVerifySubmitCompleted";
import { WasmVerifySubmitFailed } from "./WasmVerifySubmitFailed";
import { WasmVerifySubmitForm } from "./WasmVerifySubmitForm";

interface WasmVerifySubmitModalProps {
  codeId: number;
  codeHash: string;
  wasmVerifyStatus: WasmVerifyStatus;
  relatedVerifiedCodes?: number[];
  contractAddress?: BechAddr32;
  triggerElement: ReactNode;
}

interface WasmVerifySubmitModalBodyProps
  extends Omit<WasmVerifySubmitModalProps, "triggerElement"> {
  onClose: () => void;
}

const WasmVerifySubmitModalBody = ({
  onClose,
  ...props
}: WasmVerifySubmitModalBodyProps) => {
  const { mutate, isLoading, isSuccess, isError } = useSubmitWasmVerify();

  if (isError) return <WasmVerifySubmitFailed onClose={onClose} />;
  if (isSuccess) return <WasmVerifySubmitCompleted />;
  return (
    <WasmVerifySubmitForm {...props} onSubmit={mutate} isLoading={isLoading} />
  );
};

export const WasmVerifySubmitModal = ({
  triggerElement,
  ...props
}: WasmVerifySubmitModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Flex
        as="span"
        display="inline-flex"
        onClick={(e: MouseEvent<HTMLDivElement>) => {
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
          <WasmVerifySubmitModalBody {...props} onClose={onClose} />
        </ModalContent>
      </Modal>
    </>
  );
};
