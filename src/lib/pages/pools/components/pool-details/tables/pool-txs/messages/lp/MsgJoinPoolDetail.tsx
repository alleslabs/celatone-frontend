import { Box, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgJoinPoolDetails } from "lib/utils/tx/types";

import { PoolLPCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgJoinPoolDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinPoolDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgJoinPoolDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgJoinPoolDetailProps) => (
  <Flex w="full" alignItems="start" gap={12}>
    <Flex direction="column" gap={1}>
      <Text variant="body2" textColor="pebble.500" fontWeight={500}>
        Block height
      </Text>
      <ExplorerLink
        value={blockHeight.toString()}
        type="block_height"
        showCopyOnHover
      />
    </Flex>
    <Box w="full">
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolLPCard
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        msgShareAmount={msg.share_out_amount}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
