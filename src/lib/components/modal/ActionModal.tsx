import type { ReactNode } from "react";

import {
  Box,
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
import { trackUseOtherModal } from "lib/amplitude";
import { useCallback } from "react";

import type { IconKeys } from "../icon";

import { CustomIcon } from "../icon";

export interface ActionModalProps {
  icon?: IconKeys;
  iconColor?: string;
  title: string;
  subtitle?: string;
  headerContent?: ReactNode;
  trigger?: ReactNode;
  children?: ReactNode;
  mainBtnTitle?: string;
  mainAction: () => void;
  mainVariant?: string;
  disabledMain?: boolean;
  otherBtnTitle?: string;
  otherAction?: () => void;
  otherVariant?: string;
  noCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  buttonRemark?: string;
}
export function ActionModal({
  icon = "edit",
  iconColor = "gray.600",
  title,
  subtitle,
  trigger,
  headerContent,
  children,
  mainBtnTitle = "Proceed",
  mainAction,
  mainVariant = "primary",
  disabledMain = false,
  otherBtnTitle = "Cancel",
  otherAction,
  otherVariant = "outline-primary",
  noCloseButton = false,
  closeOnOverlayClick = true,
  buttonRemark,
}: ActionModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOnMain = useCallback(() => {
    mainAction();
    onClose();
  }, [onClose, mainAction]);
  const handleOnOther = useCallback(() => {
    otherAction?.();
    onClose();
  }, [onClose, otherAction]);

  return (
    <>
      <Flex
        onClick={(e) => {
          e.stopPropagation();
          trackUseOtherModal(title);
          onOpen();
        }}
      >
        {trigger || <Button>Open {title} Modal</Button>}
      </Flex>
      <Modal
        closeOnOverlayClick={closeOnOverlayClick}
        isCentered
        isOpen={isOpen}
        onClose={handleOnOther}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box w="full">
              <Flex alignItems="center" gap={3}>
                <CustomIcon boxSize={5} color={iconColor} name={icon} />
                <Heading
                  as="h5"
                  variant={{ base: "h6", md: "h5" }}
                  wordBreak="break-word"
                >
                  {title}
                </Heading>
              </Flex>
              {subtitle && (
                <Text color="text.dark" pt={2} variant="body3">
                  {subtitle}
                </Text>
              )}
              <Box>{headerContent}</Box>
            </Box>
          </ModalHeader>
          {!noCloseButton && <ModalCloseButton color="gray.600" />}
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Flex
              alignItems="center"
              direction="column"
              gap={4}
              justifyContent="center"
              w="full"
            >
              <Flex gap={2}>
                <Button
                  isDisabled={disabledMain}
                  variant={mainVariant}
                  w="200px"
                  onClick={handleOnMain}
                >
                  {mainBtnTitle}
                </Button>
                <Button
                  variant={otherVariant}
                  w="200px"
                  onClick={handleOnOther}
                >
                  {otherBtnTitle}
                </Button>
              </Flex>
              {buttonRemark && (
                <Text color="text.dark" variant="body3">
                  {buttonRemark}
                </Text>
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
