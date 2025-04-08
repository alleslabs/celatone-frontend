import type { ValidatorDelegationRelatedTxsResponseItem } from "lib/services/types";
import type { AssetInfos, MovePoolInfos, Option } from "lib/types";

import { Badge, Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileCardTemplate } from "lib/components/table";
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
    bottomContent={
      <Box>
        <Text color="text.dark" variant="body2">
          {formatUTC(delegationRelatedTx.timestamp)}
        </Text>
        <Text color="text.disabled" variant="body3">
          {`(${dateFromNow(delegationRelatedTx.timestamp)})`}
        </Text>
      </Box>
    }
    topContent={
      <Flex flexDirection="column" gap={2} w="100%">
        <Grid gap={2} templateColumns="1fr 1fr">
          <GridItem>
            <Text color="text.dark" fontWeight={600} variant="body3">
              Transaction hash
            </Text>
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
          </GridItem>
          <GridItem>
            <Text color="text.dark" fontWeight={600} variant="body3">
              Sender
            </Text>
            <ExplorerLink
              showCopyOnHover
              type="user_address"
              value={delegationRelatedTx.sender}
            />
          </GridItem>
        </Grid>
        <Box>
          <Text color="text.dark" fontWeight={600} variant="body3">
            Action
          </Text>
          <Text color="white" variant="body2">
            {delegationRelatedTx.messages.length > 1
              ? `${delegationRelatedTx.messages.length} Messages`
              : extractMsgType(delegationRelatedTx.messages[0].type)}
          </Text>
        </Box>
        <Box>
          <Text color="text.dark" fontWeight={600} variant="body3">
            Bonded token changes
          </Text>
          {delegationRelatedTx.tokens.map((coin) => (
            <DelegationRelatedTxsTokenChange
              key={delegationRelatedTx.txHash + coin.amount + coin.denom}
              assetInfos={assetInfos}
              coin={coin}
              movePoolInfos={movePoolInfos}
              txHash={delegationRelatedTx.txHash}
            />
          ))}
        </Box>
      </Flex>
    }
    onClick={() => onRowSelect(delegationRelatedTx.txHash)}
  />
);
