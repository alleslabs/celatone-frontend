import {
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import type { HexAddr20, Option, EvmVerifyInfo } from "lib/types";
import { EvmVerifyFailed } from "./EvmVerifyFailed";
import { EvmVerifyProcess } from "./EvmVerifyProcess";
import { EvmVerifyRequestInfo } from "./EvmVerifyRequestInfo";
import { CustomIcon } from "../../icon";

interface EvmVerifyStatusModalProps {
  contractAddress: HexAddr20;
  evmVerifyInfo: Option<EvmVerifyInfo>;
  isOpen: boolean;
  onClose: () => void;
}

export const EvmVerifyStatusModal = ({
  contractAddress,
  evmVerifyInfo,
  isOpen,
  onClose,
}: EvmVerifyStatusModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent w={{ base: "full", md: "645px" }} bg="gray.800" maxW="100vw">
      <ModalHeader pb={0}>
        <Flex w="full" direction="row" alignItems="center" gap={2}>
          <CustomIcon name="verification-solid" boxSize={6} color="gray.600" />
          <Heading variant={{ base: "h6", md: "h5" }} as="h5">
            Contract verification status
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.400" />
      <ModalBody p={{ base: 4, md: 6 }}>
        <Flex direction="column" gap={4}>
          <EvmVerifyRequestInfo
            contractAddress={contractAddress}
            evmVerifyInfo={evmVerifyInfo}
          />
          {evmVerifyInfo ? (
            evmVerifyInfo.error ? (
              <EvmVerifyFailed evmVerifyError={evmVerifyInfo.error} />
            ) : (
              <>
                <EvmVerifyProcess evmVerifyInfo={evmVerifyInfo} />
                <Divider borderColor="gray.700" />
              </>
            )
          ) : null}
          <Button onClick={onClose} variant="outline-primary" mt={2}>
            Close
          </Button>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);

interface EvmVerifyStatusModalTriggerProps
  extends Pick<EvmVerifyStatusModalProps, "contractAddress" | "evmVerifyInfo"> {
  triggerElement: ReactNode;
}

export const EvmVerifyStatusModalWithTrigger = ({
  triggerElement,
  contractAddress,
  evmVerifyInfo,
}: EvmVerifyStatusModalTriggerProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {triggerElement}
      </Flex>
      <EvmVerifyStatusModal
        contractAddress={contractAddress}
        evmVerifyInfo={evmVerifyInfo}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
