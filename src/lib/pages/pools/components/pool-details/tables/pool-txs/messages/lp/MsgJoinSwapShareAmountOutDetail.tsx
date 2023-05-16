import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

import { LiquidityDivider, PoolAssetCard, PoolAssetsGrid } from "./components";

interface MsgJoinSwapShareAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapShareAmountOutDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgJoinSwapShareAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgJoinSwapShareAmountOutDetailProps) => (
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
        msgShareAmount={msg.share_amount_out}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
      />
    </Flex>
  </Flex>
);
