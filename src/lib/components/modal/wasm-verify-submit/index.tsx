import {
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { ReactNode } from "react";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type { WasmVerifyRequest } from "lib/services/types";
import { useSubmitWasmVerify } from "lib/services/verification/wasm";
import type { BechAddr32, Option, WasmVerifyStatus } from "lib/types";

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
  onSubmit: (wasmVerifyRequest: WasmVerifyRequest) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMsg: Option<string>;
  onClose: () => void;
}

const WasmVerifySubmitModalBody = ({
  isSuccess,
  isError,
  errorMsg,
  onClose,
  ...props
}: WasmVerifySubmitModalBodyProps) => {
  if (isError)
    return <WasmVerifySubmitFailed errorMsg={errorMsg} onClose={onClose} />;
  if (isSuccess) return <WasmVerifySubmitCompleted />;
  return <WasmVerifySubmitForm {...props} />;
};

export const WasmVerifySubmitModal = ({
  codeId,
  codeHash,
  wasmVerifyStatus,
  relatedVerifiedCodes,
  contractAddress,
  triggerElement,
}: WasmVerifySubmitModalProps) => {
  const queryClient = useQueryClient();
  const { currentChainId } = useCelatoneApp();
  const { mutate, isLoading, isSuccess, isError, error } =
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
          e.stopPropagation();
          onOpen();
        }}
      >
        {triggerElement}
      </Flex>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent
          w={{ base: "full", md: "645px" }}
          bg="gray.800"
          maxW="100vw"
        >
          <WasmVerifySubmitModalBody
            codeId={codeId}
            codeHash={codeHash}
            wasmVerifyStatus={wasmVerifyStatus}
            relatedVerifiedCodes={relatedVerifiedCodes}
            contractAddress={contractAddress}
            onSubmit={mutate}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            errorMsg={error?.response?.data.message}
            onClose={handleClose}
          />
        </ModalContent>
      </Modal>
    </>
  );
};
