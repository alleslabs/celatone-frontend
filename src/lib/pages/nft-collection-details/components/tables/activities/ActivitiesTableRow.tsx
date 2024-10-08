import { Box, Flex, Grid, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { Activity } from "lib/services/types";
import type { HexAddr32 } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

export const getEventMessage = (
  isNftBurn: boolean,
  isNftMint: boolean,
  isNftTransfer: boolean,
  isCollectionCreate: boolean
) => {
  if (isNftBurn) return "Burned";
  if (isNftMint) return "Minted";
  if (isNftTransfer) return "Transferred";
  if (isCollectionCreate) return "Collection created";
  return "-";
};

const TokenIdRender = ({
  tokenId,
  nftAddress,
  collectionAddress,
}: {
  tokenId: Activity["tokenId"];
  nftAddress: Activity["nftAddress"];
  collectionAddress: HexAddr32;
}) => {
  if (!tokenId)
    return (
      <Text variant="body2" color="text.disabled">
        -
      </Text>
    );

  if (!nftAddress) {
    return (
      <Text color="text.dark" wordBreak="break-word">
        {tokenId}
      </Text>
    );
  }

  return (
    <AppLink href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}>
      <Text
        color="primary.main"
        _hover={{
          textDecoration: "underline",
          color: "primary.light",
        }}
        wordBreak="break-word"
      >
        {tokenId}
      </Text>
    </AppLink>
  );
};

interface ActivitiesTableRowProps {
  activity: Activity;
  templateColumns: string;
  collectionAddress: HexAddr32;
}

export const ActivitiesTableRow = ({
  activity,
  templateColumns,
  collectionAddress,
}: ActivitiesTableRowProps) => {
  const {
    txhash,
    timestamp,
    isNftBurn,
    isNftMint,
    isNftTransfer,
    isCollectionCreate,
    tokenId,
    nftAddress,
  } = activity;

  return (
    <Box w="full" minW="min-content">
      <Grid
        className="copier-wrapper"
        templateColumns={templateColumns}
        _hover={{ background: "gray.900" }}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pr={1}>
          <ExplorerLink
            value={txhash.toUpperCase()}
            type="tx_hash"
            showCopyOnHover
            ampCopierSection="nft-collection-activities-table"
          />
        </TableRow>
        <TableRow>
          <TokenIdRender
            tokenId={tokenId}
            nftAddress={nftAddress}
            collectionAddress={collectionAddress}
          />
        </TableRow>
        <TableRow>
          <Text>
            {getEventMessage(
              isNftBurn,
              isNftMint,
              isNftTransfer,
              isCollectionCreate
            )}
          </Text>
        </TableRow>
        <TableRow>
          <Flex direction="column" gap={1}>
            <Text variant="body3">{formatUTC(timestamp)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(timestamp)})`}
            </Text>
          </Flex>
        </TableRow>
      </Grid>
    </Box>
  );
};
