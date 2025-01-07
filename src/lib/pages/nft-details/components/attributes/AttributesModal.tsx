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
  address: string;
  attributes: Trait[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tokenId: string;
}

export const AttributesModal = ({
  address,
  attributes,
  isOpen,
  onClose,
  title,
  tokenId,
}: AttributesModalProps) => (
  <Modal
    isCentered
    isOpen={isOpen}
    onClose={onClose}
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" w="800px">
      <ModalHeader>
        <Flex alignItems="center" gap={3} w="full" direction="row">
          <CustomIcon m={1} name="list" boxSize={5} color="gray.600" />
          <Heading as="h5" variant="h5">
            {title}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="text.dark" />
      <ModalBody maxH="550px" p="16px 24px" overflow="overlay">
        <Stack spacing="16px">
          <Stack spacing="8px">
            <Flex gap="12px">
              <Text variant="body2" w="100px" fontWeight={700}>
                Token ID:
              </Text>
              <Text>{tokenId}</Text>
            </Flex>
            <Flex gap="12px">
              <Text variant="body2" w="100px" fontWeight={700}>
                NFT Address:
              </Text>
              <ExplorerLink type="user_address" value={address} />
            </Flex>
          </Stack>

          <Stack spacing="8px">
            {attributes.map(({ traitType, value }) => (
              <Stack
                key={traitType}
                bg="gray.900"
                gap={1}
                p="8px 12px"
                borderRadius="8px"
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
