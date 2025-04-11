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
  <Box minW="min-content" w="full">
    <Grid
      className="copier-wrapper"
      _hover={{ background: "gray.900" }}
      templateColumns={templateColumns}
      transition="all 0.25s ease-in-out"
    >
      <TableRow pr={1}>
        <ExplorerLink
          showCopyOnHover
          type="tx_hash"
          value={hash.toUpperCase()}
        />
      </TableRow>
      <TableRow>
        <Text color="text.main" variant="body2">
          {getEventMessage(isNftBurn, isNftMint, isNftTransfer)}
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
