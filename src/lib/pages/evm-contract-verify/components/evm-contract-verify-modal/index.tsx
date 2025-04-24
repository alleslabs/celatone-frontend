import type { EvmContractVerifyForm } from "lib/types";
import type { Control } from "react-hook-form";

import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

import { EvmContractVerifyModalBody } from "./EvmContractVerifyModalBody";

interface EvmContractVerifyModalProps {
  control: Control<EvmContractVerifyForm>;
  isError: boolean;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const EvmContractVerifyModal = ({
  control,
  isError,
  isLoading,
  isOpen,
  onClose,
}: EvmContractVerifyModalProps) => (
  <Modal
    closeOnOverlayClick={false}
    isCentered
    isOpen={isOpen}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" maxW="100vw" py={10} w="645px">
      <EvmContractVerifyModalBody
        control={control}
        isError={isError}
        isLoading={isLoading}
        onClose={onClose}
      />
    </ModalContent>
  </Modal>
);
