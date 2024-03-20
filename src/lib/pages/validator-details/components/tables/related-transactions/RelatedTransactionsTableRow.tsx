import { Badge, Box, Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/validator";
import type { AssetInfos, Option } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { RelatedTransactionsBondedTokenChanges } from "./RelatedTransactionsBondedTokenChanges";

interface RelatedTransactionsTableRowProps {
  delegationRelatedTx: ValidatorDelegationRelatedTxsResponseItem;
  templateColumns: string;
  onRowSelect: (txHash: string) => void;
  assetInfos: Option<AssetInfos>;
}

export const RelatedTransactionsTableRow = ({
  delegationRelatedTx,
  templateColumns,
  onRowSelect,
  assetInfos,
}: RelatedTransactionsTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    _hover={{ bg: "gray.900" }}
    transition="all 0.25s ease-in-out"
    cursor="pointer"
    minW="min-content"
    onClick={() => onRowSelect(delegationRelatedTx.txHash)}
  >
    <TableRow>
      <ExplorerLink
        value={delegationRelatedTx.txHash.toLocaleUpperCase()}
        type="tx_hash"
        showCopyOnHover
      />
      {delegationRelatedTx.messages.length > 1 && (
        <Badge variant="secondary" ml={2}>
          {delegationRelatedTx.messages.length}
        </Badge>
      )}
    </TableRow>
    <TableRow>
      <ExplorerLink
        value={delegationRelatedTx.sender}
        type="user_address"
        showCopyOnHover
      />
    </TableRow>
    <TableRow>
      <Text variant="body2" color="white">
        {delegationRelatedTx.messages.length > 1
          ? `${delegationRelatedTx.messages.length} Messages`
          : extractMsgType(delegationRelatedTx.messages[0].type)}
      </Text>
    </TableRow>
    <TableRow>
      {delegationRelatedTx.tokens.map((token) => (
        <RelatedTransactionsBondedTokenChanges
          txHash={delegationRelatedTx.txHash}
          coin={token}
          assetInfos={assetInfos}
          key={delegationRelatedTx.txHash + token.amount + token.denom}
        />
      ))}
    </TableRow>
    <TableRow>
      <Box>
        <Text variant="body2" color="text.dark">
          {formatUTC(delegationRelatedTx.timestamp)}
        </Text>
        <Text variant="body3" color="text.disabled">
          {`(${dateFromNow(delegationRelatedTx.timestamp)})`}
        </Text>
      </Box>
    </TableRow>
  </Grid>
);
