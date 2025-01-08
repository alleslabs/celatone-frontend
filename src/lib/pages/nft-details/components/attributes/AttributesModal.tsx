import {
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { Trait } from "lib/types";

interface AttributesModalProps {
  title: string;
  address: string;
  tokenId: string;
  attributes: Trait[];
  isOpen: boolean;
  onClose: () => void;
}

export const AttributesModal = ({
  title,
  address,
  tokenId,
  attributes,
  isOpen,
  onClose,
}: AttributesModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent w="800px" bg="gray.800">
      <ModalHeader>
        <Flex w="full" direction="row" alignItems="center" gap={3}>
          <CustomIcon name="list" boxSize={5} m={1} color="gray.600" />
          <Heading variant="h5" as="h5">
            {title}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="text.dark" />
      <ModalBody maxH="550px" overflow="overlay" p="16px 24px">
        <Stack spacing="16px">
          <Stack spacing="8px">
            <Flex gap="12px">
              <Text fontWeight={700} w="100px" variant="body2">
                Token ID:
              </Text>
              <Text>{tokenId}</Text>
            </Flex>
            <Flex gap="12px">
              <Text fontWeight={700} w="100px" variant="body2">
                NFT Address:
              </Text>
              <ExplorerLink value={address} type="user_address" />
            </Flex>
          </Stack>

          <Stack spacing="8px">
            {attributes.map(({ traitType, value }) => (
              <Stack
                bg="gray.900"
                borderRadius="8px"
                p="8px 12px"
                gap={1}
                key={traitType}
              >
                <Text color="text.dark" fontWeight={700}>
                  {traitType}
                </Text>
                <Text variant="body2" fontWeight={700}>
                  {value}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
);
