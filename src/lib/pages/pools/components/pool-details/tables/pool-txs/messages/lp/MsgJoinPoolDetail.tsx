import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgJoinPoolDetails } from "lib/utils/tx/types";

import { PoolAssetCard, LiquidityDivider, PoolAssetsGrid } from "./components";

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
    <Flex direction="column" minW="100px">
      <Text variant="body2" textColor="pebble.500" fontWeight={500}>
        Block height
      </Text>
      <ExplorerLink
        value={blockHeight.toString()}
        type="block_height"
        showCopyOnHover
      />
    </Flex>
    <Flex direction="column" gap={3}>
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolAssetCard
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        msgShareAmount={msg.share_out_amount}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
      />
    </Flex>
  </Flex>
);
