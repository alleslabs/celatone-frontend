import {
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useInitia } from "lib/app-provider";

import { CustomIcon } from "../icon";

export const NoMobile = () => {
  const isInitia = useInitia();

  return (
    <Modal isCentered isOpen size="sm" onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          align="center"
          direction="column"
          justify="center"
          p={8}
          textAlign="center"
        >
          <CustomIcon boxSize={10} color="primary.light" name="info-circle" />
          <Heading as="h5" py={1} variant="h5">
            Sorry, this feature is currently not supported on mobile.
          </Heading>
          <Text color="text.dark" mt={2} variant="body1">
            Please use {isInitia ? "Initia Scan" : "Celatone"} through the
            desktop browser for the best experience with this feature.
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
