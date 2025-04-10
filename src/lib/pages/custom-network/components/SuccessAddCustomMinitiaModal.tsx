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
import { CustomIcon } from "lib/components/icon";
import { useEffect, useState } from "react";

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
      closeOnOverlayClick={false}
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent bg="gray.800" maxW="100vw" py={10} w="645px">
        {fakeLoading ? (
          <>
            <ModalHeader w="full">
              <Stack alignItems="center" gap={4} w="100%">
                <Spinner h={16} thickness="4px" w={16} />
                <Heading variant="h5">Adding custom rollup...</Heading>
              </Stack>
            </ModalHeader>
            <ModalBody maxH="400px" overflow="overlay">
              <Text color="text.dark" textAlign="center" variant="body2">
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
                  boxSize={14}
                  color="success.main"
                  name="check-circle-solid"
                />
                <Heading variant="h5">“{prettyName}” is added!</Heading>
              </Stack>
            </ModalHeader>
            <ModalBody maxH="400px" overflow="overlay">
              <Text color="text.dark" textAlign="center" variant="body2">
                Your custom rollup is added to the Initia Scan locally on your
                device. You also can download the configuration in to JSON file
                to import them in other devices.
              </Text>
            </ModalBody>
            <ModalFooter py={0}>
              <Button
                rightIcon={<CustomIcon boxSize={4} name="chevron-right" />}
                variant="primary"
                w="100%"
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
