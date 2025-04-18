import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/types";
import type { AssetInfos, MovePoolInfos, Option } from "lib/types";

import { Badge, Box, Grid, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { DelegationRelatedTxsTokenChange } from "./DelegationRelatedTxsTokenChange";

interface DelegationRelatedTxsTableRowProps {
  delegationRelatedTx: ValidatorDelegationRelatedTxsResponseItem;
  templateColumns: string;
  assetInfos: Option<AssetInfos>;
  movePoolInfos: Option<MovePoolInfos>;
  onRowSelect: (txHash: string) => void;
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
    _hover={{ bg: "gray.900" }}
    cursor="pointer"
    minW="min-content"
    templateColumns={templateColumns}
    transition="all 0.25s ease-in-out"
    onClick={() => onRowSelect(delegationRelatedTx.txHash)}
  >
    <TableRow>
      <ExplorerLink
        showCopyOnHover
        type="tx_hash"
        value={delegationRelatedTx.txHash.toLocaleUpperCase()}
      />
      {delegationRelatedTx.messages.length > 1 && (
        <Badge ml={2} variant="primary-light">
          {delegationRelatedTx.messages.length}
        </Badge>
      )}
    </TableRow>
    <TableRow>
      <ExplorerLink
        showCopyOnHover
        type="user_address"
        value={delegationRelatedTx.sender}
      />
    </TableRow>
    <TableRow>
      <Text color="white" variant="body2">
        {delegationRelatedTx.messages.length > 1
          ? `${delegationRelatedTx.messages.length} Messages`
          : extractMsgType(delegationRelatedTx.messages[0].type)}
      </Text>
    </TableRow>
    <TableRow>
      {delegationRelatedTx.tokens.map((coin) => (
        <DelegationRelatedTxsTokenChange
          key={delegationRelatedTx.txHash + coin.amount + coin.denom}
          assetInfos={assetInfos}
          coin={coin}
          movePoolInfos={movePoolInfos}
          txHash={delegationRelatedTx.txHash}
        />
      ))}
    </TableRow>
    <TableRow>
      <Box>
        <Text color="text.dark" variant="body2">
          {formatUTC(delegationRelatedTx.timestamp)}
        </Text>
        <Text color="text.disabled" variant="body3">
          {`(${dateFromNow(delegationRelatedTx.timestamp)})`}
        </Text>
      </Box>
    </TableRow>
  </Grid>
);
