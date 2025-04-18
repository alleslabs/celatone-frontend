import type { TxResultRendering } from "lib/types";

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
import { useInternalNavigate } from "lib/app-provider";
import { TxStreamPhase } from "lib/types";
import { useCallback } from "react";

import { TxReceiptRender } from "../TxReceiptRender";
import { ButtonSection } from "./ButtonSection";

interface TxModalProps {
  result: TxResultRendering;
  onClose: () => void;
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
      closeOnOverlayClick={false}
      isCentered
      isOpen
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
              borderRadius="8px"
              maxH="240px"
              mt={4}
              overflowY="scroll"
              p={2}
            >
              <Text>{result.receiptInfo.errorMsg}</Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter gap={2}>
          <ButtonSection
            actionVariant={result.actionVariant}
            errorMsg={result.receiptInfo.errorMsg}
            receipts={result.receipts}
            onClose={onClose}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
