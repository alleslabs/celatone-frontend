import {
  Box,
  Button,
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
import { Tooltip } from "lib/components/Tooltip";

interface ViewFailedReasonProps {
  text: string;
}

export const ViewFailedReason = ({ text }: ViewFailedReasonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (text.length === 0)
    return (
      <Tooltip label="This proposal failed before the &lsquo;failed_reason&rsquo; field is added to the network.">
        <Text
          as="span"
          color="text.disabled"
          cursor="not-allowed"
          variant="body2"
          whiteSpace="nowrap"
        >
          View failed reason
        </Text>
      </Tooltip>
    );

  return (
    <>
      <Text
        _hover={{ color: "primary.light", textDecoration: "underline" }}
        as="span"
        color="primary.main"
        cursor="pointer"
        transition="all 0.25s ease-in-out"
        variant="body2"
        onClick={onOpen}
      >
        View failed reason
      </Text>

      <Modal
        isCentered
        isOpen={isOpen}
        returnFocusOnClose={false}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Failed reason</ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody>
            <Box
              bg="background.main"
              borderRadius="8px"
              maxH="240px"
              mt={4}
              overflowY="scroll"
              p={2}
            >
              <Text>{text}</Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline-primary" w="120px" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
