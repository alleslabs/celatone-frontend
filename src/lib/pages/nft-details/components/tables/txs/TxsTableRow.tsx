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
  hash: string;
  isNftBurn: boolean;
  isNftMint: boolean;
  isNftTransfer: boolean;
  templateColumns: string;
  timestamp: Date;
}

export const TxsTableRow = ({
  hash,
  isNftBurn,
  isNftMint,
  isNftTransfer,
  templateColumns,
  timestamp,
}: TxsTableRowProps) => (
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
          value={hash.toUpperCase()}
          showCopyOnHover
        />
      </TableRow>
      <TableRow>
        <Text variant="body2" color="text.main">
          {getEventMessage(isNftBurn, isNftMint, isNftTransfer)}
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
