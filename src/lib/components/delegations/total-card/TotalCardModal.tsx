import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import type Big from "big.js";

import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { TokenComposition, TokenImageRender } from "lib/components/token";
import { big } from "lib/types";
import type { BechAddr, TokenWithValue, USD } from "lib/types";
import {
  compareTokenWithValues,
  formatPrice,
  getTokenLabel,
  totalValueTokenWithValue,
} from "lib/utils";

import { TotalCardTop } from "./TotalCardTop";

interface TotalCardModel {
  title: string;
  message: string;
  address: BechAddr;
  tokens: Record<string, TokenWithValue>;
  isOpen: boolean;
  onClose: () => void;
}

const DelegationTokenCard = ({ token }: { token: TokenWithValue }) => (
  <Flex
    bg="gray.900"
    borderRadius="8px"
    p={{ base: 3, md: "12px 16px" }}
    alignItems={{ base: "flex-start", md: "center" }}
    justifyContent="space-between"
    gap={{ base: 1, md: 0 }}
    direction={{ base: "column", md: "row" }}
  >
    <Flex align="center" gap={2}>
      <TokenImageRender boxSize={6} logo={token.logo} alt={token.denom} />
      <Text variant="body1" fontWeight={700}>
        {getTokenLabel(token.denom, token.symbol)}
      </Text>
    </Flex>
    <TokenComposition
      token={token}
      alignItems={{ base: "flex-start", md: "flex-end" }}
    />
  </Flex>
);

export const TotalCardModal = ({
  title,
  message,
  tokens,
  address,
  isOpen,
  onClose,
}: TotalCardModel) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    isCentered
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent w={{ base: "full", md: "800px" }} bg="gray.800" maxW="100vw">
      <ModalHeader>
        <Flex w="full" direction="row" alignItems="center" gap={3}>
          <CustomIcon name="assets-solid" boxSize={5} m={1} color="gray.600" />
          <Heading variant="h5" as="h5">
            {title}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.400" />
      <ModalBody maxH="400px" overflow="overlay">
        <Flex direction="column" gap={4}>
          <Grid templateColumns="1fr 1fr">
            <GridItem>
              <Flex direction="column" gap={1}>
                <TotalCardTop
                  title={title}
                  message={message}
                  fontWeight={600}
                />
                <Heading variant="h6" as="h6">
                  {formatPrice(
                    totalValueTokenWithValue(tokens, big(0) as USD<Big>)
                  )}
                </Heading>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex direction="column" gap="2px">
                <Text variant="body2" fontWeight={600} textColor="text.dark">
                  Account address
                </Text>
                <CopyLink value={address} type="user_address" isTruncate />
              </Flex>
            </GridItem>
          </Grid>
          <Flex gap={2} direction="column">
            {Object.values(tokens)
              .sort(compareTokenWithValues)
              .map((token) => (
                <DelegationTokenCard key={token.denom} token={token} />
              ))}
          </Flex>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);
