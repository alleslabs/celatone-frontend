import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { CustomIcon } from "lib/components/icon";

interface SuccessAddCustomMinitiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  prettyName: string;
  chainId: string;
}

export const SuccessAddCustomMinitiaModal = ({
  isOpen,
  onClose,
  prettyName,
  chainId,
}: SuccessAddCustomMinitiaModalProps) => {
  const [fakeLoading, setFakeLoading] = useState(false);

  useEffect(() => {
    setFakeLoading(true);

    const timeoutId = setTimeout(() => {
      setFakeLoading((newFakeLoading) => !newFakeLoading);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent w="645px" bg="gray.800" maxW="100vw" py={10}>
        {fakeLoading ? (
          <>
            <ModalHeader w="full">
              <Stack alignItems="center" gap={4} w="100%">
                <Spinner w={16} h={16} thickness="4px" />
                <Heading variant="h5">Adding custom rollup...</Heading>
              </Stack>
            </ModalHeader>
            <ModalBody maxH="400px" overflow="overlay">
              <Text variant="body2" color="text.dark" textAlign="center">
                Your rollup’s information is being processed, and the scan’s for
                rollup will be ready shortly. Please do not close the browser
                during this process.
              </Text>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader w="full">
              <Stack alignItems="center" gap={4} w="100%">
                <CustomIcon
                  name="check-circle-solid"
                  color="success.main"
                  boxSize={14}
                />
                <Heading variant="h5">“{prettyName}” is added!</Heading>
              </Stack>
            </ModalHeader>
            <ModalBody maxH="400px" overflow="overlay">
              <Text variant="body2" color="text.dark" textAlign="center">
                Your custom rollup is added to the Initia Scan locally on your
                device. You also can download the configuration in to JSON file
                to import them in other devices.
              </Text>
            </ModalBody>
            <ModalFooter py={0}>
              <Button
                variant="primary"
                w="100%"
                rightIcon={<CustomIcon name="chevron-right" boxSize={4} />}
                onClick={() => {
                  window.location.href = `/${chainId}`;
                }}
              >
                Explore new rollup
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
