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

import { useInternalNavigate } from "lib/app-provider";
import type { TxResultRendering } from "lib/types";
import { TxStreamPhase } from "lib/types";

import { ButtonSection } from "./ButtonSection";
import { TxReceiptRender } from "../TxReceiptRender";

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

  const showCloseButton = result.phase === TxStreamPhase.SUCCEED;

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
        {showCloseButton && <ModalCloseButton color="gray.600" />}
        <ModalBody>
          {result.receiptInfo.description && (
            <Text variant="body1" mb={4}>
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
              p={2}
              mt={4}
              maxH="240px"
              overflowY="scroll"
            >
              <Text>{result.receiptInfo.errorMsg}</Text>
            </Box>
          )}
        </ModalBody>
        <ModalFooter gap={2}>
          <ButtonSection
            actionVariant={result.actionVariant}
            onClose={onClose}
            receipts={result.receipts}
            errorMsg={result.receiptInfo.errorMsg}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
