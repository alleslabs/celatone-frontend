import type Big from "big.js";
import type { BechAddr, TokenWithValue, USD } from "lib/types";

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
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { TokenComposition, TokenImageWithAmount } from "lib/components/token";
import { big } from "lib/types";
import {
  compareTokenWithValues,
  formatPrice,
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
    borderRadius="8px"
    direction={{ base: "column", md: "row" }}
    gap={{ base: 1, md: 0 }}
    justifyContent="space-between"
    p={{ base: 3, md: "12px 16px" }}
  >
    <TokenImageWithAmount
      boxSize={6}
      fontWeight={700}
      token={token}
      variant="body1"
    />
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
    returnFocusOnClose={false}
    onClose={onClose}
  >
    <ModalOverlay />
    <ModalContent bg="gray.800" maxW="100vw" w={{ base: "full", md: "800px" }}>
      <ModalHeader>
        <Flex alignItems="center" direction="row" gap={3} w="full">
          <CustomIcon boxSize={5} color="gray.600" m={1} name="assets-solid" />
          <Heading as="h5" variant="h5">
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
                  fontWeight={600}
                  message={message}
                  title={title}
                />
                <Heading as="h6" variant="h6">
                  {formatPrice(
                    totalValueTokenWithValue(tokens, big(0) as USD<Big>)
                  )}
                </Heading>
              </Flex>
            </GridItem>
            <GridItem>
              <Flex direction="column" gap="2px">
                <Text fontWeight={600} textColor="text.dark" variant="body2">
                  Account address
                </Text>
                <CopyLink isTruncate type="user_address" value={address} />
              </Flex>
            </GridItem>
          </Grid>
          <Flex direction="column" gap={2}>
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
