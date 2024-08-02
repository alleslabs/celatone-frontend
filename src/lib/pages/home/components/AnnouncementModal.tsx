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
              Annoucement Title
            </Heading>
            <Text variant="body1" textAlign="center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
              illo sed facere voluptatum similique harum, ducimus, incidunt
              ipsum fugit vitae dicta, laborum voluptatem delectus quo
              perferendis neque qui exercitationem dolorum.
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
