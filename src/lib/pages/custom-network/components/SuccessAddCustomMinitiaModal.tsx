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
  chainId: string;
  isOpen: boolean;
  onClose: () => void;
  prettyName: string;
}

export const SuccessAddCustomMinitiaModal = ({
  chainId,
  isOpen,
  onClose,
  prettyName,
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
      isCentered
      isOpen={isOpen}
      closeOnOverlayClick={false}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent bg="gray.800" maxW="100vw" py={10} w="645px">
        {fakeLoading ? (
          <>
            <ModalHeader w="full">
              <Stack alignItems="center" gap={4} w="100%">
                <Spinner h={16} thickness="4px" w={16} />
                <Heading variant="h5">Adding Custom Minitia...</Heading>
              </Stack>
            </ModalHeader>
            <ModalBody maxH="400px" overflow="overlay">
              <Text textAlign="center" variant="body2" color="text.dark">
                Your minitia’s information is being processed, and the scan’s
                for minitia will be ready shortly. Please do not close the
                browser during this process.
              </Text>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader w="full">
              <Stack alignItems="center" gap={4} w="100%">
                <CustomIcon
                  name="check-circle-solid"
                  boxSize={14}
                  color="success.main"
                />
                <Heading variant="h5">“{prettyName}” is added!</Heading>
              </Stack>
            </ModalHeader>
            <ModalBody maxH="400px" overflow="overlay">
              <Text textAlign="center" variant="body2" color="text.dark">
                Your custom minitia is added to the InitiaScan locally on your
                device. You also can download the configuration in to JSON file
                to import them in other devices.
              </Text>
            </ModalBody>
            <ModalFooter py={0}>
              <Button
                variant="primary"
                w="100%"
                onClick={() => {
                  window.location.href = `/${chainId}`;
                }}
                rightIcon={<CustomIcon name="chevron-right" boxSize={4} />}
              >
                Explore new Minitia
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
