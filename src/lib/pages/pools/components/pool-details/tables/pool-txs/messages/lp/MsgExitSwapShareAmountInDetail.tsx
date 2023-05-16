import { Box, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";

import { PoolAssetCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgExitSwapShareAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapShareAmountInDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgExitSwapShareAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgExitSwapShareAmountInDetailProps) => (
  <Flex minW="full" alignItems="start" gap={12}>
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
      <PoolAssetCard
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        msgShareAmount={msg.share_in_amount}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        msgSwapDenom={msg.token_out_denom}
        isJoin={false}
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
