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
  const { isOpen, onClose, onOpen } = useDisclosure();
  if (text.length === 0)
    return (
      <Tooltip label="This proposal failed before the &lsquo;failed_reason&rsquo; field is added to the network.">
        <Text
          as="span"
          variant="body2"
          whiteSpace="nowrap"
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
        _hover={{ color: "primary.light", textDecoration: "underline" }}
        color="primary.main"
        cursor="pointer"
        onClick={onOpen}
        transition="all 0.25s ease-in-out"
      >
        View Failed Reason
      </Text>

      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Failed Reason</ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody>
            <Box
              bg="background.main"
              maxH="240px"
              mt={4}
              p={2}
              borderRadius="8px"
              overflowY="scroll"
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
