import type { WasmVerifyRequest } from "lib/services/types";
import type { BechAddr32, Option, WasmVerifyStatus } from "lib/types";
import type { ReactNode } from "react";

import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import { useSubmitWasmVerify } from "lib/services/verification/wasm";
import { useCallback } from "react";

import { WasmVerifySubmitCompleted } from "./WasmVerifySubmitCompleted";
import { WasmVerifySubmitFailed } from "./WasmVerifySubmitFailed";
import { WasmVerifySubmitForm } from "./WasmVerifySubmitForm";

interface WasmVerifySubmitModalProps {
  codeHash: Option<string>;
  codeId: number;
  contractAddress?: BechAddr32;
  disabled?: boolean;
  relatedVerifiedCodes?: number[];
  triggerElement: ReactNode;
  wasmVerifyStatus: WasmVerifyStatus;
}

interface WasmVerifySubmitModalBodyProps
  extends Omit<WasmVerifySubmitModalProps, "triggerElement"> {
  errorMsg: Option<string>;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  onClose: () => void;
  onSubmit: (wasmVerifyRequest: WasmVerifyRequest) => void;
}

const WasmVerifySubmitModalBody = ({
  errorMsg,
  isError,
  isSuccess,
  onClose,
  ...props
}: WasmVerifySubmitModalBodyProps) => {
  if (isError)
    return <WasmVerifySubmitFailed errorMsg={errorMsg} onClose={onClose} />;
  if (isSuccess) return <WasmVerifySubmitCompleted onClose={onClose} />;
  return <WasmVerifySubmitForm {...props} />;
};

export const WasmVerifySubmitModal = ({
  codeHash,
  codeId,
  contractAddress,
  disabled,
  relatedVerifiedCodes,
  triggerElement,
  wasmVerifyStatus,
}: WasmVerifySubmitModalProps) => {
  const queryClient = useQueryClient();
  const { currentChainId } = useCelatoneApp();
  const { error, isError, isLoading, isSuccess, mutate } =
    useSubmitWasmVerify();

  const { isOpen, onClose, onOpen } = useDisclosure();
  const handleClose = useCallback(() => {
    if (isSuccess || isError)
      queryClient.invalidateQueries({
        queryKey: [
          CELATONE_QUERY_KEYS.WASM_VERIFICATION_INFOS,
          currentChainId,
          codeId,
        ],
      });
    onClose();
  }, [codeId, currentChainId, isError, isSuccess, onClose, queryClient]);

  return (
    <>
      <Flex
        as="span"
        display="inline-flex"
        onClick={(e) => {
          if (disabled) return;
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
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent
          bg="gray.800"
          maxW="100vw"
          w={{ base: "full", md: "645px" }}
        >
          <WasmVerifySubmitModalBody
            codeHash={codeHash}
            codeId={codeId}
            contractAddress={contractAddress}
            errorMsg={error?.response?.data.message}
            isError={isError}
            isLoading={isLoading}
            isSuccess={isSuccess}
            relatedVerifiedCodes={relatedVerifiedCodes}
            wasmVerifyStatus={wasmVerifyStatus}
            onClose={handleClose}
            onSubmit={mutate}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
