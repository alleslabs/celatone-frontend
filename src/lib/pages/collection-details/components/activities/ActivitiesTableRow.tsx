import { Grid, Box, Text } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { Activity } from "lib/services/collection";
import type { HexAddr } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

interface ActivitiesTableRowProps {
  activity: Activity;
  templateColumns: string;
  collectionAddress: HexAddr;
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

  const getEventMessage = () => {
    if (isNftBurn) return "Burned";
    if (isNftMint) return "Minted";
    if (isNftTransfer) return "Transferred";
    if (isCollectionCreate) return "Collection created";
    return "-";
  };

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
          />
        </TableRow>
        <TableRow>
          {tokenId ? (
            <AppLink
              href={`/nft-collections/${collectionAddress}/nft/${nftAddress}`}
            >
              <Text
                color="primary.dark"
                _hover={{ textDecoration: "underline", color: "primary.light" }}
              >
                {tokenId}
              </Text>
            </AppLink>
          ) : (
            "-"
          )}
        </TableRow>
        <TableRow>
          <Text>{getEventMessage()}</Text>
        </TableRow>
        <TableRow>
          <Box>
            <Text fontSize="14px" color="gray.400">
              {formatUTC(timestamp)}
            </Text>
            <Text fontSize="12px" color="gray.500">
              ({dateFromNow(timestamp)})
            </Text>
          </Box>
        </TableRow>
      </Grid>
    </Box>
  );
};
