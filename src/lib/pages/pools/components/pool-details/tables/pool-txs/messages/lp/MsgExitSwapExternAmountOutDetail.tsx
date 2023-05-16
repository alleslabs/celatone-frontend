import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

import { PoolAssetCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgExitSwapExternAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapExternAmountOutDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgExitSwapExternAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgExitSwapExternAmountOutDetailProps) => (
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
      <PoolAssetCard
        txHash={txHash}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        msgAssets={[msg.token_out]}
        isJoin={false}
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
    </Flex>
  </Flex>
);
