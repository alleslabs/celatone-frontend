import {
  Modal,
  Flex,
  Icon,
  Text,
  ModalOverlay,
  ModalContent,
  Heading,
} from "@chakra-ui/react";
import { IoIosWarning } from "react-icons/io";

export function NoMobile() {
  return (
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
          <Icon as={IoIosWarning} color="error.light" boxSize="50px" />

          <Heading as="h5" py="4">
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
}
