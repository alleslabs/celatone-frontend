import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useCallback } from "react";

import { TxReceiptRender } from "../TxReceiptRender";
import { useInternalNavigate } from "lib/app-provider";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";

import { ButtonSection } from "./ButtonSection";

interface TxModalProps {
  result: TxResultRendering;
  onClose: () => void;
}

export const TxModal = ({ result, onClose }: TxModalProps) => {
  const navigate = useInternalNavigate();

  const isUpdateAdminSucceed =
    result.phase === TxStreamPhase.SUCCEED &&
    result.actionVariant === "update-admin";

  const handleModalClose = useCallback(() => {
    if (isUpdateAdminSucceed) {
      navigate({ pathname: "/admin" });
    }
    onClose();
  }, [navigate, onClose, isUpdateAdminSucceed]);

  return (
    <Modal
      isOpen
      onClose={handleModalClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent w="600px">
        <ModalHeader>
          {result.receiptInfo.headerIcon}
          {result.receiptInfo.header}
        </ModalHeader>
        {isUpdateAdminSucceed && <ModalCloseButton color="pebble.600" />}
        {(result.receiptInfo.description || result.receipts.length > 0) && (
          <ModalBody>
            {result.receiptInfo.description && (
              <Text variant="body1" mb="16px">
                {result.receiptInfo.description}
              </Text>
            )}
            <TxReceiptRender receipts={result.receipts} />
          </ModalBody>
        )}
        <ModalFooter gap="8px">
          <ButtonSection
            actionVariant={result.actionVariant}
            onClose={onClose}
            receipts={result.receipts}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
