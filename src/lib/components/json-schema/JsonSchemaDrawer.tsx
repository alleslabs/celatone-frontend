import {
  Heading,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

import { AttachStatus } from "./AttachStatus";
import { UploadTemplate } from "./UploadTemplate";

interface JsonSchemaDrawerProps {
  codeId: string;
  codeHash: string;
  isOpen: boolean;
  onClose: () => void;
  onSchemaSave?: () => void;
}

export const JsonSchemaDrawer = ({
  codeId,
  codeHash,
  isOpen,
  onClose,
  onSchemaSave,
}: JsonSchemaDrawerProps) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
    <ModalOverlay />
    <ModalContent w="840px">
      <ModalHeader>
        <CustomIcon name="code" boxSize={6} color="gray.600" />
        <Heading as="h5" variant="h5">
          Attach JSON Schema for code ID “{codeId}”
        </Heading>
      </ModalHeader>
      <ModalCloseButton color="gray.600" />
      <ModalBody px={4} maxH="640px" overflow="scroll" pt={0}>
        <AttachStatus codeId={codeId} />
        <UploadTemplate
          codeHash={codeHash}
          codeId={codeId}
          closeDrawer={onClose}
          onSchemaSave={onSchemaSave}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
);
