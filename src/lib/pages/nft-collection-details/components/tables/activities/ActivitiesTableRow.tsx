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
  collectionAddress,
  nftAddress,
  tokenId,
}: {
  collectionAddress: HexAddr32;
  nftAddress: Activity["nftAddress"];
  tokenId: Activity["tokenId"];
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
        _hover={{
          color: "primary.light",
          textDecoration: "underline",
        }}
        color="primary.main"
        wordBreak="break-word"
      >
        {tokenId}
      </Text>
    </AppLink>
  );
};

interface ActivitiesTableRowProps {
  activity: Activity;
  collectionAddress: HexAddr32;
  templateColumns: string;
}

export const ActivitiesTableRow = ({
  activity,
  collectionAddress,
  templateColumns,
}: ActivitiesTableRowProps) => {
  const {
    isCollectionCreate,
    isNftBurn,
    isNftMint,
    isNftTransfer,
    nftAddress,
    timestamp,
    tokenId,
    txhash,
  } = activity;

  return (
    <Box minW="min-content" w="full">
      <Grid
        className="copier-wrapper"
        _hover={{ background: "gray.900" }}
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pr={1}>
          <ExplorerLink
            type="tx_hash"
            value={txhash.toUpperCase()}
            ampCopierSection="nft-collection-activities-table"
            showCopyOnHover
          />
        </TableRow>
        <TableRow>
          <TokenIdRender
            nftAddress={nftAddress}
            collectionAddress={collectionAddress}
            tokenId={tokenId}
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
          <Flex gap={1} direction="column">
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
