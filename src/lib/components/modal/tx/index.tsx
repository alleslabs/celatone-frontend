import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { TxReceiptRender } from "lib/components/tx/receipt";
import type { TxResultRendering } from "lib/types";

import { ButtonSection } from "./ButtonSection";

interface TxModalProps {
  result: TxResultRendering;
  onClose: () => void;
}

export const TxModal = ({ result, onClose }: TxModalProps) => {
  return (
    <Modal isOpen onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent w="600px">
        <ModalHeader>
          {result.receiptInfo.headerIcon}
          {result.receiptInfo.header}
        </ModalHeader>
        {(result.receiptInfo.description || result.receipts.length > 0) && (
          <ModalBody>
            {result.receiptInfo.description && (
              <Text variant="body1" color="text.main" mb="16px">
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
