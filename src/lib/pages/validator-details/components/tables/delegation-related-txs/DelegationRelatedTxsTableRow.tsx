import { Badge, Box, Grid, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/types";
import type { AssetInfos, MovePoolInfos, Option } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { DelegationRelatedTxsTokenChange } from "./DelegationRelatedTxsTokenChange";

interface DelegationRelatedTxsTableRowProps {
  assetInfos: Option<AssetInfos>;
  delegationRelatedTx: ValidatorDelegationRelatedTxsResponseItem;
  movePoolInfos: Option<MovePoolInfos>;
  onRowSelect: (txHash: string) => void;
  templateColumns: string;
}

export const DelegationRelatedTxsTableRow = ({
  assetInfos,
  delegationRelatedTx,
  movePoolInfos,
  onRowSelect,
  templateColumns,
}: DelegationRelatedTxsTableRowProps) => (
  <Grid
    className="copier-wrapper"
    minW="min-content"
    _hover={{ bg: "gray.900" }}
    cursor="pointer"
    onClick={() => onRowSelect(delegationRelatedTx.txHash)}
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
  >
    <TableRow>
      <ExplorerLink
        type="tx_hash"
        value={delegationRelatedTx.txHash.toLocaleUpperCase()}
        showCopyOnHover
      />
      {delegationRelatedTx.messages.length > 1 && (
        <Badge ml={2} variant="primary-light">
          {delegationRelatedTx.messages.length}
        </Badge>
      )}
    </TableRow>
    <TableRow>
      <ExplorerLink
        type="user_address"
        value={delegationRelatedTx.sender}
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
      {delegationRelatedTx.tokens.map((coin) => (
        <DelegationRelatedTxsTokenChange
          key={delegationRelatedTx.txHash + coin.amount + coin.denom}
          txHash={delegationRelatedTx.txHash}
          assetInfos={assetInfos}
          coin={coin}
          movePoolInfos={movePoolInfos}
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
