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
  codeId: number;
  codeHash: string;
  isOpen: boolean;
  isReattach?: boolean;
  onClose: () => void;
  onSchemaSave?: () => void;
}

export const JsonSchemaModal = ({
  codeId,
  codeHash,
  isOpen,
  isReattach = false,
  onClose,
  onSchemaSave,
}: JsonSchemaModalProps) => (
  <Modal
    isCentered
    isOpen={isOpen}
    scrollBehavior="inside"
    size="4xl"
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent h="680px" w="840px">
      <ModalHeader>
        <CustomIcon boxSize={6} color="gray.600" name="code" />
        <Heading as="h5" variant="h5">
          Attach JSON Schema for code ID “{codeId}”
        </Heading>
      </ModalHeader>
      <ModalCloseButton color="gray.600" />
      <ModalBody maxH="640px" overflow="scroll" px={4} py={1}>
        <AttachStatus codeId={codeId} isReattach={isReattach} />
        <UploadTemplate
          closeDrawer={onClose}
          codeHash={codeHash}
          codeId={codeId}
          isReattach={isReattach}
          onSchemaSave={onSchemaSave}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
);
