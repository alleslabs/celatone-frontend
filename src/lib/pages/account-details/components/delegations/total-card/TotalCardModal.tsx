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
import type { Big } from "big.js";
import big from "big.js";

import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import type { Addr, TokenWithValue, USD } from "lib/types";
import {
  compareTokenWithValues,
  formatPrice,
  totalValueTokenWithValue,
} from "lib/utils";

import { TotalCardTop } from "./TotalCardTop";

interface TotalCardModel {
  title: string;
  message: string;
  address: Addr;
  tokens: Record<string, TokenWithValue>;
  isOpen: boolean;
  onClose: () => void;
}

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
    <ModalContent w="640px">
      <ModalHeader>
        <Flex w="full" direction="row" alignItems="center" gap={3}>
          <CustomIcon name="assets-solid" boxSize={5} m={1} color="gray.600" />
          <Heading variant="h5" as="h5">
            {title}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalCloseButton color="gray.600" />
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
                  Wallet Address
                </Text>
                <CopyLink value={address} type="user_address" isTruncate />
              </Flex>
            </GridItem>
          </Grid>
          <Flex gap={2} direction="column">
            {/* TODO: fix */}
            {Object.values(tokens)
              .sort(compareTokenWithValues)
              .map((token) => (
                <Text>{`${token.amount}${token.denom}`}</Text>
              ))}
          </Flex>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);
