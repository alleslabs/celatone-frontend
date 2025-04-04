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
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    size="4xl"
    scrollBehavior="inside"
  >
    <ModalOverlay />
    <ModalContent w="840px" h="680px">
      <ModalHeader>
        <CustomIcon name="code" boxSize={6} color="gray.600" />
        <Heading as="h5" variant="h5">
          Attach JSON schema for code ID “{codeId}”
        </Heading>
      </ModalHeader>
      <ModalCloseButton color="gray.600" />
      <ModalBody px={4} maxH="640px" overflow="scroll" py={1}>
        <AttachStatus codeId={codeId} isReattach={isReattach} />
        <UploadTemplate
          codeHash={codeHash}
          codeId={codeId}
          isReattach={isReattach}
          closeDrawer={onClose}
          onSchemaSave={onSchemaSave}
        />
      </ModalBody>
    </ModalContent>
  </Modal>
);
