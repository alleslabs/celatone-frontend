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
          variant="body2"
          color="text.disabled"
          cursor="not-allowed"
        >
          View Failed Reason
        </Text>
      </Tooltip>
    );

  return (
    <>
      <Text
        as="span"
        variant="body2"
        color="secondary.main"
        transition="all 0.25s ease-in-out"
        _hover={{ color: "secondary.light", textDecoration: "underline" }}
        cursor="pointer"
        onClick={onOpen}
      >
        View Failed Reason
      </Text>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent w="600px">
          <ModalHeader>Failed Reason</ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody>
            <Box
              bg="background.main"
              borderRadius="8px"
              p={2}
              mt={4}
              maxH="240px"
              overflowY="scroll"
            >
              <Text>{text}</Text>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline-primary" onClick={onClose} w="120px">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
