import { Grid, Box, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { Activity } from "lib/services/collection";
import { dateFromNow, formatUTC } from "lib/utils";

interface ActivitiesTableRowProps {
  activity: Activity;
  templateColumns: string;
}

export const ActivitiesTableRow = ({
  activity,
  templateColumns,
}: ActivitiesTableRowProps) => {
  const { txhash, timestamp, isNftBurn, isNftMint, isNftTransfer, tokenId } =
    activity;

  const getEventMessage = () => {
    if (isNftBurn) return "Burned";
    if (isNftMint) return "Minted";
    if (isNftTransfer) return "Transferred";
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
          <ExplorerLink value={txhash} type="tx_hash" showCopyOnHover />
        </TableRow>
        <TableRow>
          <Text>{tokenId ?? "-"}</Text>
        </TableRow>
        <TableRow>
          <Text>{getEventMessage()}</Text>
        </TableRow>
        <TableRow>
          <Box>
            <Text>{formatUTC(timestamp)}</Text>
            <Text>{dateFromNow(timestamp)}</Text>
          </Box>
        </TableRow>
      </Grid>
    </Box>
  );
};
