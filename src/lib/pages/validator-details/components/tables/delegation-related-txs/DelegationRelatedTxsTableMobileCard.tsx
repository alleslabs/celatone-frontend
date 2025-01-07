import { Badge, Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/types";
import type { AssetInfos, MovePoolInfos, Option } from "lib/types";
import { dateFromNow, extractMsgType, formatUTC } from "lib/utils";

import { DelegationRelatedTxsTokenChange } from "./DelegationRelatedTxsTokenChange";

interface DelegationRelatedTxsTableMobileCardProps {
  assetInfos: Option<AssetInfos>;
  delegationRelatedTx: ValidatorDelegationRelatedTxsResponseItem;
  movePoolInfos: Option<MovePoolInfos>;
  onRowSelect: (txHash: string) => void;
}

export const DelegationRelatedTxsTableMobileCard = ({
  assetInfos,
  delegationRelatedTx,
  movePoolInfos,
  onRowSelect,
}: DelegationRelatedTxsTableMobileCardProps) => (
  <MobileCardTemplate
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
    topContent={
      <Flex gap={2} w="100%" flexDirection="column">
        <Grid gap={2} templateColumns="1fr 1fr">
          <GridItem>
            <Text variant="body3" color="text.dark" fontWeight={600}>
              Transaction Hash
            </Text>
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
          </GridItem>
          <GridItem>
            <Text variant="body3" color="text.dark" fontWeight={600}>
              Sender
            </Text>
            <ExplorerLink
              type="user_address"
              value={delegationRelatedTx.sender}
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
              key={delegationRelatedTx.txHash + coin.amount + coin.denom}
              txHash={delegationRelatedTx.txHash}
              assetInfos={assetInfos}
              coin={coin}
              movePoolInfos={movePoolInfos}
            />
          ))}
        </Box>
      </Flex>
    }
  />
);
