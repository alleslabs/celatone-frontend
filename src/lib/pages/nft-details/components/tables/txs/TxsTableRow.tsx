import { Box, Flex, Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

export const getEventMessage = (
  isNftBurn: boolean,
  isNftMint: boolean,
  isNftTransfer: boolean
) => {
  if (isNftBurn) return "Burned";
  if (isNftMint) return "Minted";
  if (isNftTransfer) return "Transferred";
  return "-";
};

interface TxsTableRowProps {
  templateColumns: string;
  hash: string;
  timestamp: Date;
  isNftBurn: boolean;
  isNftMint: boolean;
  isNftTransfer: boolean;
}

export const TxsTableRow = ({
  templateColumns,
  hash,
  timestamp,
  isNftBurn,
  isNftMint,
  isNftTransfer,
}: TxsTableRowProps) => (
  <Box w="full" minW="min-content">
    <Grid
      className="copier-wrapper"
      templateColumns={templateColumns}
      _hover={{ background: "gray.900" }}
      transition="all 0.25s ease-in-out"
    >
      <TableRow pr={1}>
        <ExplorerLink
          value={hash.toUpperCase()}
          type="tx_hash"
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <Text variant="body2" color="text.main">
          {getEventMessage(isNftBurn, isNftMint, isNftTransfer)}
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
