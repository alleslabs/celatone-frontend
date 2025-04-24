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
        <Flex alignItems="center" justifyContent="center" pt={4} w="full">
          <Image
            alt=""
            src="/allesinitialogo.svg"
            width={{ base: 280, md: 320 }}
          />
        </Flex>
      </ModalHeader>
      <ModalBody maxH="400px" overflow="overlay">
        <Divider color="gray.700" mb={6} />
        <Flex alignItems="center" direction="column" gap={3} textAlign="center">
          <Heading as="h5" variant="h5">
            Alles Labs is joining{" "}
            <span style={{ display: "inline-flex" }}>Initia Labs</span>
          </Heading>
          <Text color="text.dark" textAlign="center" variant="body1">
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
          direction="row"
          gap={4}
          justifyContent="center"
          w="full"
        >
          <Button
            cursor="pointer"
            minW="256px"
            variant="outline-primary"
            onClick={onClose}
          >
            Close
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
);
