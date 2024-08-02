import {
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const AnnouncementModal = ({
  isOpen,
  onClose,
}: AnnouncementModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent w="640px">
        <ModalHeader py={2}>
          <Flex w="full" justifyContent="center" alignItems="center" pt={4}>
            <Image src="/allesinitialogo.svg" alt="" width={320} />
          </Flex>
        </ModalHeader>
        <ModalBody maxH="400px" overflow="overlay">
          <Divider color="gray.700" mb={6} />
          <Flex direction="column" gap={3} alignItems="center">
            <Heading as="h5" variant="h5">
              Alles Labs is joining Initia Labs
            </Heading>
            <Text variant="body1" textAlign="center">
              Alles Labs, the team behind Celatone, is joining Initia Labs to
              enhance the user and developer experience within the Initia
              ecosystem. The Celatone explorer on existing chains will continue
              to operate without any changes.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex
            w="full"
            direction="row"
            align="center"
            justifyContent="center"
            gap={4}
          >
            <Button
              cursor="pointer"
              variant="ghost-secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
