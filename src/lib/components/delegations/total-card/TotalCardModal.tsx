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
  address: BechAddr;
  isOpen: boolean;
  message: string;
  onClose: () => void;
  title: string;
  tokens: Record<string, TokenWithValue>;
}

const DelegationTokenCard = ({ token }: { token: TokenWithValue }) => (
  <Flex
    alignItems={{ base: "flex-start", md: "center" }}
    bg="gray.900"
    gap={{ base: 1, md: 0 }}
    p={{ base: 3, md: "12px 16px" }}
    borderRadius="8px"
    direction={{ base: "column", md: "row" }}
    justifyContent="space-between"
  >
    <Flex align="center" gap={2}>
      <TokenImageRender alt={token.denom} boxSize={6} logo={token.logo} />
      <Text variant="body1" fontWeight={700}>
        {getTokenLabel(token.denom, token.symbol)}
      </Text>
    </Flex>
    <TokenComposition
      alignItems={{ base: "flex-start", md: "flex-end" }}
      token={token}
    />
  </Flex>
);

export const TotalCardModal = ({
  address,
  isOpen,
  message,
  onClose,
  title,
  tokens,
}: TotalCardModel) => (
  <Modal
    isCentered
    isOpen={isOpen}
    onClose={onClose}
    returnFocusOnClose={false}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" maxW="100vw" w={{ base: "full", md: "800px" }}>
      <ModalHeader>
        <Flex alignItems="center" gap={3} w="full" direction="row">
          <CustomIcon m={1} name="assets-solid" boxSize={5} color="gray.600" />
          <Heading as="h5" variant="h5">
            {title}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.400" />
      <ModalBody maxH="400px" overflow="overlay">
        <Flex gap={4} direction="column">
          <Grid templateColumns="1fr 1fr">
            <GridItem>
              <Flex gap={1} direction="column">
                <TotalCardTop
                  message={message}
                  title={title}
                  fontWeight={600}
                />
                <Heading as="h6" variant="h6">
                  {formatPrice(
                    totalValueTokenWithValue(tokens, big(0) as USD<Big>)
                  )}
                </Heading>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex gap="2px" direction="column">
                <Text variant="body2" fontWeight={600} textColor="text.dark">
                  Account Address
                </Text>
                <CopyLink isTruncate type="user_address" value={address} />
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
