import {
  Flex,
  Heading,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { useMobile } from "lib/app-provider";

export const NoMobile = () => {
  const isMobile = useMobile();

  if (!isMobile) return null;

  return (
    <Modal size="sm" isOpen isCentered onClose={() => {}}>
      <ModalOverlay bg="background.main" />
      <ModalContent>
        <Flex
          direction="column"
          justify="center"
          align="center"
          p={8}
          textAlign="center"
        >
          <CustomIcon
            name="info-circle-solid"
            color="primary.light"
            boxSize={10}
          />
          <Heading as="h5" variant="h5" py={1}>
            Sorry, this feature is currently not supported on mobile.
          </Heading>
          <Text variant="body1" color="text.dark" mt={2}>
            Please use Celatone through the desktop browser for the best
            experience with this feature.
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
