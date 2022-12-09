import {
  Modal,
  ModalHeader,
  Flex,
  Icon,
  Box,
  Text,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { useCallback } from "react";
import type { IconType } from "react-icons/lib";
import { MdMode } from "react-icons/md";

interface ModalProps {
  icon?: IconType;
  iconColor?: string;
  title: string;
  subtitle?: string;
  headerContent?: ReactNode;
  trigger?: ReactNode;
  children?: ReactNode;
  mainBtnTitle?: string;
  mainAction: () => void;
  disabledMain?: boolean;
  otherBtnTitle?: string;
  otherAction?: () => void;
}
export function ActionModal({
  icon = MdMode,
  iconColor = "gray.600",
  title,
  subtitle,
  trigger,
  headerContent,
  children,
  mainBtnTitle = "Proceed",
  mainAction,
  disabledMain = false,
  otherBtnTitle = "Cancel",
  otherAction,
}: ModalProps) {
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
      <Flex onClick={onOpen}>
        {trigger || <Button>Open {title} Modal</Button>}
      </Flex>
      <Modal isOpen={isOpen} onClose={handleOnOther} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={1} borderColor="divider.main">
            <Box>
              <Flex alignItems="center" gap="3">
                <Icon as={icon} color={iconColor} boxSize="6" />
                {title}
              </Flex>
              {subtitle && (
                <Text variant="body3" color="gray.400" pt="2">
                  {subtitle}
                </Text>
              )}
              <Box>{headerContent}</Box>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Flex w="full" justifyContent="center" gap="2">
              <Button
                w="200px"
                onClick={handleOnMain}
                isDisabled={disabledMain}
              >
                {mainBtnTitle}
              </Button>
              <Button
                w="200px"
                variant="outline-primary"
                onClick={handleOnOther}
              >
                {otherBtnTitle}
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
