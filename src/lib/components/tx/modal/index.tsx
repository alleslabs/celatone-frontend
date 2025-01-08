import {
  Box,
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
  onClose: () => void;
  result: TxResultRendering;
}

export const TxModal = ({ onClose, result }: TxModalProps) => {
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

  const showCloseButton = result.phase === TxStreamPhase.SUCCEED;

  return (
    <Modal
      isCentered
      isOpen
      closeOnOverlayClick={false}
      onClose={handleModalClose}
    >
      <ModalOverlay />
      <ModalContent w="600px">
        <ModalHeader>
          {result.receiptInfo.headerIcon}
          {result.receiptInfo.header}
        </ModalHeader>
        {showCloseButton && <ModalCloseButton color="gray.600" />}
        <ModalBody>
          {result.receiptInfo.description && (
            <Text mb={4} variant="body1">
              {result.receiptInfo.description}
            </Text>
          )}
          {result.receipts.length > 0 && (
            <TxReceiptRender receipts={result.receipts} />
          )}
          {result.receiptInfo.errorMsg && (
            <Box
              bg="background.main"
              maxH="240px"
              mt={4}
              p={2}
              borderRadius="8px"
              overflowY="scroll"
            >
              <Text>{result.receiptInfo.errorMsg}</Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter gap={2}>
          <ButtonSection
            receipts={result.receipts}
            actionVariant={result.actionVariant}
            errorMsg={result.receiptInfo.errorMsg}
            onClose={onClose}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
