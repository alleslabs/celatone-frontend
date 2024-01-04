import { Grid, Box, Text, Flex, Badge } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxsTableRowProps {
  hash: string;
  timestamp: Date;
  templateColumns: string;
  isNftBurn: boolean;
  isNftMint: boolean;
  isNftTransfer: boolean;
}

export const TxsTableRow = ({
  hash,
  timestamp,
  templateColumns,
  isNftBurn,
  isNftMint,
  isNftTransfer,
}: TxsTableRowProps) => {
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
            value={hash.toUpperCase()}
            type="tx_hash"
            showCopyOnHover
          />
        </TableRow>
        <TableRow>
          <Flex gap="8px">
            {isNftBurn && <Badge textTransform="capitalize">Burn</Badge>}
            {isNftMint && <Badge textTransform="capitalize">Mint</Badge>}
            {isNftTransfer && (
              <Badge textTransform="capitalize">Transfer</Badge>
            )}
          </Flex>
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
