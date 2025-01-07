import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

import { AttachStatus } from "./AttachStatus";
import { UploadTemplate } from "./UploadTemplate";

interface JsonSchemaModalProps {
  codeHash: string;
  codeId: number;
  isOpen: boolean;
  isReattach?: boolean;
  onClose: () => void;
  onSchemaSave?: () => void;
}

export const JsonSchemaModal = ({
  codeHash,
  codeId,
  isOpen,
  isReattach = false,
  onClose,
  onSchemaSave,
}: JsonSchemaModalProps) => (
  <Modal
    isCentered
    isOpen={isOpen}
    size="4xl"
    onClose={onClose}
    scrollBehavior="inside"
  >
    <ModalOverlay />
    <ModalContent h="680px" w="840px">
      <ModalHeader>
        <CustomIcon name="code" boxSize={6} color="gray.600" />
        <Heading as="h5" variant="h5">
          Attach JSON Schema for code ID “{codeId}”
        </Heading>
      </ModalHeader>
      <ModalCloseButton color="gray.600" />
      <ModalBody maxH="640px" px={4} py={1} overflow="scroll">
        <AttachStatus isReattach={isReattach} codeId={codeId} />
        <UploadTemplate
          isReattach={isReattach}
          closeDrawer={onClose}
          codeHash={codeHash}
          codeId={codeId}
          onSchemaSave={onSchemaSave}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
);
