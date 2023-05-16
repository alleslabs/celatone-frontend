import { Box, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

import { LiquidityDivider, PoolAssetCard, PoolAssetsGrid } from "./components";

interface MsgJoinSwapExternAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapExternAmountInDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgJoinSwapExternAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgJoinSwapExternAmountInDetailProps) => (
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
    <Box w="full">
      <PoolAssetsGrid
        msgIndex={msgIndex}
        msgAssets={[msg.token_in]}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolAssetCard
        txHash={txHash}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
