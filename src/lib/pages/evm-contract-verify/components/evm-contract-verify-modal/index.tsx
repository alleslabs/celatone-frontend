import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { EvmContractVerifyModalBody } from "./EvmContractVerifyModalBody";
import type { Control } from "react-hook-form";
import { EvmContractVerifyForm } from "lib/services/types";

interface EvmContractVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isError: boolean;
  isLoading: boolean;
  control: Control<EvmContractVerifyForm>;
}

export const EvmContractVerifyModal = ({
  isOpen,
  onClose,
  isError,
  isLoading,
  control,
}: EvmContractVerifyModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    closeOnOverlayClick={false}
  >
    <ModalOverlay />
    <ModalContent w="645px" bg="gray.800" maxW="100vw" py={10}>
      <EvmContractVerifyModalBody
        isError={isError}
        isLoading={isLoading}
        onClose={onClose}
        control={control}
      />
    </ModalContent>
  </Modal>
);
