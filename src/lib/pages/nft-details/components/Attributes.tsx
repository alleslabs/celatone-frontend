import {
  Badge,
  Button,
  Flex,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import type { HexAddr, Trait } from "lib/types";

interface AttributesModalProps {
  title: string;
  address: string;
  tokenId: string;
  attributes: Trait[];
  isOpen: boolean;
  onClose: () => void;
}

const AttributesModal = ({
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
      <ModalCloseButton color="gray.400" />
      <ModalBody maxH="550px" overflow="overlay" p="16px 24px">
        <Stack spacing="16px">
          <Stack spacing="8px">
            <Flex gap="12px" fontSize="14px">
              <Text fontWeight={700} w="100px">
                Token ID:
              </Text>
              <Text>{tokenId}</Text>
            </Flex>
            <Flex gap="12px" fontSize="14px">
              <Text fontWeight={700} w="100px">
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
                spacing="4px"
                key={traitType}
              >
                <Text color="gray.400" fontSize="12px" fontWeight={700}>
                  {traitType}
                </Text>
                <Text fontSize="14px" fontWeight={700}>
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

const Attributes = ({
  attributes,
  nftAddress,
  tokenId,
}: {
  attributes: Trait[];
  nftAddress: HexAddr;
  tokenId: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useMobile();
  const displayedCount = isMobile ? 4 : 6;

  return (
    <Stack w="100%" spacing="16px">
      <Flex align="center" gap="4px">
        <Text fontSize="14px" fontWeight={700}>
          Attributes
        </Text>
        <Badge bg="primary.main" color="gray.900">
          {attributes.length}
        </Badge>
      </Flex>

      <SimpleGrid
        templateColumns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
        minChildWidth="172px"
        spacing="16px"
      >
        {attributes.slice(0, displayedCount).map(({ traitType, value }) => (
          <GridItem
            p="8px 12px"
            background="gray.900"
            borderRadius="8px"
            key={traitType}
          >
            <Stack spacing="4px">
              <Text fontSize="12px" fontWeight={700} color="gray.400">
                {traitType}
              </Text>
              <Text fontSize="14px" fontWeight={700}>
                {value}
              </Text>
            </Stack>
          </GridItem>
        ))}
      </SimpleGrid>

      {attributes.length > displayedCount && (
        <Button
          bg="transparent"
          _hover={{ background: "transparent" }}
          onClick={onOpen}
        >
          <Flex align="center" gap="7px">
            <Text color="gray.400">View More</Text>
            <CustomIcon name="chevron-down" color="gray.400" />
          </Flex>
        </Button>
      )}

      <AttributesModal
        title="Attributes"
        attributes={attributes}
        address={nftAddress}
        tokenId={tokenId}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Stack>
  );
};

export default Attributes;
