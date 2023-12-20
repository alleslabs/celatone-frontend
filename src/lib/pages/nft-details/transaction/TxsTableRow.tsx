import { Grid, Box, Text, Flex, Badge } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxsTableRowProps {
  hash: string;
  timestamp: string;
  templateColumns: string;
  isNFTBurn: boolean;
  isNFTMint: boolean;
  isNFTTransfer: boolean;
}

export const TxsTableRow = ({
  hash,
  timestamp,
  templateColumns,
  isNFTBurn,
  isNFTMint,
  isNFTTransfer,
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
          <ExplorerLink value={hash} type="tx_hash" showCopyOnHover />
        </TableRow>
        <TableRow>
          <Flex gap="8px">
            {isNFTBurn && <Badge textTransform="capitalize">Burn</Badge>}
            {isNFTMint && <Badge textTransform="capitalize">Mint</Badge>}
            {isNFTTransfer && (
              <Badge textTransform="capitalize">Transfer</Badge>
            )}
          </Flex>
        </TableRow>
        <TableRow>
          <Box>
            <Text>{formatUTC(new Date(timestamp))}</Text>
            <Text>{dateFromNow(new Date(timestamp))}</Text>
          </Box>
        </TableRow>
      </Grid>
    </Box>
  );
};
