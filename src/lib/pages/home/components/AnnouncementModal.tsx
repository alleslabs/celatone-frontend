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
}: AnnouncementModalProps) => (
  <Modal isCentered isOpen={isOpen} onClose={() => {}}>
    <ModalOverlay />
    <ModalContent w="640px">
      <ModalHeader py={2}>
        <Flex alignItems="center" pt={4} w="full" justifyContent="center">
          <Image
            width={{ base: 280, md: 320 }}
            alt=""
            src="/allesinitialogo.svg"
          />
        </Flex>
      </ModalHeader>
      <ModalBody maxH="400px" overflow="overlay">
        <Divider mb={6} color="gray.700" />
        <Flex alignItems="center" gap={3} textAlign="center" direction="column">
          <Heading as="h5" variant="h5">
            Alles Labs is joining{" "}
            <span style={{ display: "inline-flex" }}>Initia Labs</span>
          </Heading>
          <Text textAlign="center" variant="body1" color="text.dark">
            Alles Labs, the team behind Celatone, is joining Initia Labs to
            enhance the user and developer experience within the Initia
            ecosystem. The Celatone explorer on existing chains will continue to
            operate without any changes.
          </Text>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Flex
          align="center"
          gap={4}
          w="full"
          direction="row"
          justifyContent="center"
        >
          <Button
            minW="256px"
            variant="outline-primary"
            cursor="pointer"
            onClick={onClose}
          >
            Close
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
