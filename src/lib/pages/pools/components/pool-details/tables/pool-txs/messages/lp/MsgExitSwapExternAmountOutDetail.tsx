import { Box, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgExitSwapExternAmountOutDetails } from "lib/utils/tx/types";

import { PoolLPCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgExitSwapExternAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapExternAmountOutDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgExitSwapExternAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgExitSwapExternAmountOutDetailProps) => (
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
      <PoolLPCard
        txHash={txHash}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
      <LiquidityDivider />
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        msgAssets={[msg.token_out]}
        isJoin={false}
        assetInfos={assetInfos}
        isOpened={isOpened}
        ampCopierSection={ampCopierSection}
      />
    </Box>
  </Flex>
);
