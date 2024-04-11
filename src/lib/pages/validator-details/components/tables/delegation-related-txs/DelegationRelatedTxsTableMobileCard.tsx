import { Badge, Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/validator";
import type { AssetInfos, MovePoolInfos, Option } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { DelegationRelatedTxsTokenChange } from "./DelegationRelatedTxsTokenChange";

interface DelegationRelatedTxsTableMobileCardProps {
  delegationRelatedTx: ValidatorDelegationRelatedTxsResponseItem;
  assetInfos: Option<AssetInfos>;
  movePoolInfos: Option<MovePoolInfos>;
  onRowSelect: (txHash: string) => void;
}

export const DelegationRelatedTxsTableMobileCard = ({
  delegationRelatedTx,
  assetInfos,
  movePoolInfos,
  onRowSelect,
}: DelegationRelatedTxsTableMobileCardProps) => (
  <MobileCardTemplate
    topContent={
      <Flex w="100%" flexDirection="column" gap={2}>
        <Grid templateColumns="1fr 1fr" gap={2}>
          <GridItem>
            <Text variant="body3" color="text.dark" fontWeight={600}>
              Transaction Hash
            </Text>
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
          </GridItem>
          <GridItem>
            <Text variant="body3" color="text.dark" fontWeight={600}>
              Sender
            </Text>
            <ExplorerLink
              value={delegationRelatedTx.sender}
              type="user_address"
              showCopyOnHover
            />
          </GridItem>
        </Grid>
        <Box>
          <Text variant="body3" color="text.dark" fontWeight={600}>
            Action
          </Text>
          <Text variant="body2" color="white">
            {delegationRelatedTx.messages.length > 1
              ? `${delegationRelatedTx.messages.length} Messages`
              : extractMsgType(delegationRelatedTx.messages[0].type)}
          </Text>
        </Box>
        <Box>
          <Text variant="body3" color="text.dark" fontWeight={600}>
            Bonded Token Changes
          </Text>
          {delegationRelatedTx.tokens.map((coin) => (
            <DelegationRelatedTxsTokenChange
              txHash={delegationRelatedTx.txHash}
              coin={coin}
              assetInfos={assetInfos}
              movePoolInfos={movePoolInfos}
              key={delegationRelatedTx.txHash + coin.amount + coin.denom}
            />
          ))}
        </Box>
      </Flex>
    }
    bottomContent={
      <Box>
        <Text variant="body2" color="text.dark">
          {formatUTC(delegationRelatedTx.timestamp)}
        </Text>
        <Text variant="body3" color="text.disabled">
          {`(${dateFromNow(delegationRelatedTx.timestamp)})`}
        </Text>
      </Box>
    }
    onClick={() => onRowSelect(delegationRelatedTx.txHash)}
  />
);
