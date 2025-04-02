import type { HexAddr20, Option, EvmVerifyInfo } from "lib/types";
import type { ReactNode } from "react";

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

import { CustomIcon } from "../../icon";
import { EvmVerifyFailed } from "./EvmVerifyFailed";
import { EvmVerifyProcess } from "./EvmVerifyProcess";
import { EvmVerifyRequestInfo } from "./EvmVerifyRequestInfo";

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
    isCentered
    isOpen={isOpen}
    returnFocusOnClose={false}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" maxW="100vw" w={{ base: "full", md: "645px" }}>
      <ModalHeader pb={0}>
        <Flex alignItems="center" direction="row" gap={2} w="full">
          <CustomIcon boxSize={6} color="gray.600" name="verification-solid" />
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            Contract Verification Status
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
          <Button mt={2} variant="outline-primary" onClick={onClose}>
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
