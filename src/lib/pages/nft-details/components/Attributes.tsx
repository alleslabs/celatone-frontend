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
    <Stack w="100%" spacing={4} order={{ base: "-1", md: "1" }}>
      <Flex align="center" gap={1}>
        <Heading as="h6" variant="h6" fontWeight={600}>
          Attributes
        </Heading>
        <Badge bg="primary.main" color="gray.900">
          {attributes.length}
        </Badge>
      </Flex>

      <SimpleGrid
        templateColumns={isMobile ? "1fr 1fr" : "1fr 1fr 1fr"}
        minChildWidth="172px"
        gap={4}
      >
        {attributes.slice(0, displayedCount).map(({ traitType, value }) => (
          <GridItem
            p="8px 12px"
            background="gray.900"
            borderRadius="8px"
            key={traitType}
          >
            <Stack spacing="4px">
              <Text
                variant="body3"
                textTransform="capitalize"
                fontWeight={700}
                color="text.dark"
              >
                {traitType}
              </Text>
              <Text variant="body2" textTransform="capitalize" fontWeight={700}>
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
            <Text color="text.dark">View More</Text>
            <CustomIcon name="chevron-down" color="text.dark" />
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
