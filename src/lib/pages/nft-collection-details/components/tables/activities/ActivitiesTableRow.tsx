import type { Activity } from "lib/services/types";
import type { HexAddr32 } from "lib/types";

import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
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
      <Text color="text.disabled" variant="body2">
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
          textDecoration: "underline",
          color: "primary.light",
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
    <Box minW="min-content" w="full">
      <Grid
        className="copier-wrapper"
        _hover={{ background: "gray.900" }}
        templateColumns={templateColumns}
        transition="all 0.25s ease-in-out"
      >
        <TableRow pr={1}>
          <ExplorerLink
            ampCopierSection="nft-collection-activities-table"
            showCopyOnHover
            type="tx_hash"
            value={txhash.toUpperCase()}
          />
        </TableRow>
        <TableRow>
          <TokenIdRender
            collectionAddress={collectionAddress}
            nftAddress={nftAddress}
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
          <Flex direction="column" gap={1}>
            <Text variant="body3">{formatUTC(timestamp)}</Text>
            <Text color="text.dark" variant="body3">
              {`(${dateFromNow(timestamp)})`}
            </Text>
          </Flex>
        </TableRow>
      </Grid>
    </Box>
  );
};
