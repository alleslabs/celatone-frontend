import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { useCurrentChain } from "lib/app-provider";
import { useRedo } from "lib/hooks";
import type { Message, Msg } from "lib/types";
import { extractMsgType } from "lib/utils";

interface RedoModalProps {
  message: Message;
}

export const RedoModal = ({ message }: RedoModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const onClickRedo = useRedo();
  const { chainName } = useCurrentChain();

  return (
    <>
      <Button
        size="sm"
        variant="outline-gray"
        iconSpacing="2"
        leftIcon={<CustomIcon name="redo" />}
        onClick={onOpen}
      >
        Redo
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="640px">
          <ModalHeader>
            <Flex alignItems="center" gap={2} pt={1} w="full" direction="row">
              <CustomIcon name="redo" boxSize={5} color="gray.600" />
              <Heading as="h5" variant="h5">
                Redo Instantiate
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="400px" overflow="overlay">
            <Flex gap={5} direction="column">
              <Flex gap={4} direction="row">
                <Text variant="body1">
                  This contract was instantiated through{" "}
                  <span style={{ fontWeight: 700 }}>
                    &#x2018;MsgInstantiateContract2&#x2019;
                  </span>
                  , which our app does not currently support. <br /> <br /> You
                  can instead instantiate the contract using{" "}
                  <span style={{ fontWeight: 700 }}>
                    &#x2018;MsgInstantiateContract&#x2019;
                  </span>{" "}
                  for the time being
                </Text>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Flex
              align="center"
              gap={4}
              w="full"
              direction="row"
              justifyContent="end"
            >
              <Button
                variant="ghost-primary"
                cursor="pointer"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) =>
                  onClickRedo(
                    e,
                    extractMsgType(message.type),
                    message.detail as Msg,
                    chainName
                  )
                }
              >{`Redo with \u2018MsgInstantiateContract\u2019`}</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
