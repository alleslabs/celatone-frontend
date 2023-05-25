import { Box, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgJoinSwapShareAmountOutDetails } from "lib/utils/tx/types";

import { LiquidityDivider, PoolLPCard, PoolAssetsGrid } from "./components";

interface MsgJoinSwapShareAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapShareAmountOutDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgJoinSwapShareAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgJoinSwapShareAmountOutDetailProps) => (
  <Flex w="full" alignItems="start" gap={12}>
    <Flex direction="column" gap={1}>
      <Text variant="body2" textColor="pebble.500" fontWeight={500}>
        Block height
      </Text>
      <ExplorerLink
        value={blockHeight.toString()}
        type="block_height"
        showCopyOnHover
        ampCopierSection={ampCopierSection}
      />
    </Flex>
    <Box w="full">
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
      <LiquidityDivider />
      <PoolLPCard
        msgIndex={msgIndex}
        msgShareAmount={msg.share_amount_out}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Box>
  </Flex>
);
