import {
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { useInitia } from "lib/app-provider";

export const NoMobile = () => {
  const isInitia = useInitia();

  return (
    <Modal isCentered isOpen size="sm" onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          align="center"
          justify="center"
          p={8}
          textAlign="center"
          direction="column"
        >
          <CustomIcon name="info-circle" boxSize={10} color="primary.light" />
          <Heading as="h5" py={1} variant="h5">
            Sorry, this feature is currently not supported on mobile.
          </Heading>
          <Text mt={2} variant="body1" color="text.dark">
            Please use {isInitia ? "Initia Scan" : "Celatone"} through the
            desktop browser for the best experience with this feature.
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
