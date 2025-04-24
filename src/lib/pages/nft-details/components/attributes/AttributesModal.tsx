import type { Trait } from "lib/types";

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
    returnFocusOnClose={false}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" w="800px">
      <ModalHeader>
        <Flex alignItems="center" direction="row" gap={3} w="full">
          <CustomIcon boxSize={5} color="gray.600" m={1} name="list" />
          <Heading as="h5" variant="h5">
            {title}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="text.dark" />
      <ModalBody maxH="550px" overflow="overlay" p="16px 24px">
        <Stack spacing="16px">
          <Stack spacing="8px">
            <Flex gap="12px">
              <Text fontWeight={700} variant="body2" w="100px">
                Token ID:
              </Text>
              <Text>{tokenId}</Text>
            </Flex>
            <Flex gap="12px">
              <Text fontWeight={700} variant="body2" w="100px">
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
                borderRadius="8px"
                gap={1}
                p="8px 12px"
              >
                <Text color="text.dark" fontWeight={700}>
                  {traitType}
                </Text>
                <Text fontWeight={700} variant="body2">
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
