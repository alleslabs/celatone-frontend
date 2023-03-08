import {
  Modal,
  Flex,
  Text,
  ModalOverlay,
  ModalContent,
  Heading,
} from "@chakra-ui/react";

import { CustomIcon } from "../icon";

export const NoMobile = () => (
  <Modal size="sm" isOpen isCentered onClose={() => {}}>
    <ModalOverlay />
    <ModalContent>
      <Flex
        direction="column"
        justify="center"
        align="center"
        padding="8"
        textAlign="center"
      >
        <CustomIcon
          name="info-circle-solid"
          color="violet.light"
          boxSize="10"
        />
        <Heading as="h6" py="4">
          Sorry, we currently do not support mobile use.
        </Heading>
        <Text variant="body1">
          Please use Celatone through the desktop browser for the best
          experience.
        </Text>
      </Flex>
    </ModalContent>
  </Modal>
);
