import type { Option, TokenWithValue } from "lib/types";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useAssetInfos } from "lib/services/assetService";
import { useMoveDexPoolInfo } from "lib/services/move/dex";
import {
  coinToTokenWithValue,
  formatTokenWithValue,
  formatUTC,
  getTokenLabel,
  parseUnixToDate,
} from "lib/utils";

import { TokenImageRender } from "./token";

interface MergedPositionsProps {
  initialPositions: {
    amount: string;
    initialReleaseTimestamp: string;
  }[];
  liquidityDenom: string;
}

const MergedPosition = ({
  liquidityDenom,
  position,
  underlyingCoins,
}: {
  liquidityDenom: string;
  position: {
    amount: string;
    initialReleaseTimestamp: string;
  };
  underlyingCoins: Option<TokenWithValue[]>;
}) => {
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const token = coinToTokenWithValue(
    liquidityDenom,
    position.amount,
    assetInfos
  );

  return (
    <Grid
      backgroundColor="gray.800"
      borderRadius={4}
      gridTemplateColumns="1fr 1fr"
      px={4}
      py={3}
      w="full"
    >
      <Flex gap={1}>
        <Flex align="center" minW={8}>
          {underlyingCoins?.map((token) => (
            <Flex key={token.denom} align="center" marginInlineEnd="-4px">
              <TokenImageRender
                alt={getTokenLabel(token.denom, token.symbol)}
                boxSize={4}
                logo={token.logo}
              />
            </Flex>
          ))}
        </Flex>
        <Text>{formatTokenWithValue(token, undefined, true)}</Text>
      </Flex>
      <Text color="text.dark">
        {formatUTC(parseUnixToDate(position.initialReleaseTimestamp))}
      </Text>
    </Grid>
  );
};

export const MergedPositions = ({
  initialPositions,
  liquidityDenom,
}: MergedPositionsProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: assetInfos } = useAssetInfos({ withPrices: true });
  const { data: moveDexPool } = useMoveDexPoolInfo(liquidityDenom);
  const underlyingCoins = moveDexPool?.coins?.map((coin) =>
    coinToTokenWithValue(coin.denom, "0", assetInfos)
  );

  return (
    <>
      <Flex align="center" gap={2}>
        <Text variant="body2">{initialPositions.length} positions</Text>
        <Button size="sm" variant="ghost-gray" onClick={onOpen}>
          View details
        </Button>
      </Flex>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="800px">
          <ModalHeader>
            <Box
              borderBottom="1px solid"
              borderColor="gray.700"
              pb={4}
              pt={2}
              w="full"
            >
              <Heading as="h6" variant="h7">
                Merged positions ({initialPositions.length})
              </Heading>
            </Box>
          </ModalHeader>
          <ModalCloseButton color="gray.600" />
          <ModalBody
            display="flex"
            flexDirection="column"
            gap={2}
            maxH="400px"
            overflow="overlay"
            pb={6}
          >
            <Grid gridTemplateColumns="1fr 1fr">
              <Text color="text.dark" fontWeight={700} variant="body3">
                Positions
              </Text>
              <Text color="text.dark" fontWeight={700} variant="body3">
                Past release date
              </Text>
            </Grid>
            {initialPositions.map((position, index) => (
              <MergedPosition
                key={`${liquidityDenom}-${position.amount}-${index}`}
                liquidityDenom={liquidityDenom}
                position={position}
                underlyingCoins={underlyingCoins}
              />
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
