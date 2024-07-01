import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface UploadCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const UploadCompletedModal = ({
  isOpen,
  onClose,
  children,
}: UploadCompletedModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent w={{ base: "full", md: "645px" }} bg="gray.800" maxW="100vw">
      {children}
    </ModalContent>
  </Modal>
);
