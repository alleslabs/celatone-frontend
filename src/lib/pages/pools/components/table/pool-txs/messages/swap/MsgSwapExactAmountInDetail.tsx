import { Flex, Text } from "@chakra-ui/react";

import type { MsgSwapExactAmountIn } from "../messages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";

import { PoolRoute } from "./PoolRoute";
import { PoolSwap } from "./PoolSwap";

interface MsgSwapExactAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgSwapExactAmountIn;
  assetInfos: AssetInfosOpt;
}

export const MsgSwapExactAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
}: MsgSwapExactAmountInDetailProps) => (
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
    <Flex direction="column" gap={6}>
      <PoolSwap txHash={txHash} msgIndex={msgIndex} assetInfos={assetInfos} />
      <PoolRoute routes={msg.routes} assetInfos={assetInfos} />
    </Flex>
  </Flex>
);
