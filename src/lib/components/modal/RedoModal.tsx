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

import { useCurrentChain } from "lib/app-provider";
import { useRedo } from "lib/hooks";
import type { Message, Msg } from "lib/types";
import { extractMsgType } from "lib/utils";
import { CustomIcon } from "../icon";

interface RedoModalProps {
  message: Message;
}

export const RedoModal = ({ message }: RedoModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onClickRedo = useRedo();
  const { chainName } = useCurrentChain();

  return (
    <>
      <Button
        leftIcon={<CustomIcon name="redo" />}
        variant="outline-gray"
        iconSpacing="2"
        size="sm"
        onClick={onOpen}
      >
        Redo
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent w="640px">
          <ModalHeader>
            <Flex w="full" direction="row" alignItems="center" gap={2} pt={1}>
              <CustomIcon name="redo" boxSize={5} color="gray.600" />
              <Heading variant="h5" as="h5">
                Redo instantiate
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody maxH="400px" overflow="overlay">
            <Flex direction="column" gap={5}>
              <Flex direction="row" gap={4}>
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
              w="full"
              direction="row"
              align="center"
              justifyContent="end"
              gap={4}
            >
              <Button
                cursor="pointer"
                variant="ghost-primary"
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
