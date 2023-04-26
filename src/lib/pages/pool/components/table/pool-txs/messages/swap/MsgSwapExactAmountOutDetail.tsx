import { Flex, Text } from "@chakra-ui/react";

import type { MsgSwapExactAmountOut } from "../messages";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";

import { PoolRoute } from "./PoolRoute";
import { PoolSwap } from "./PoolSwap";

interface MsgSwapExactAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgSwapExactAmountOut;
  assetInfos: AssetInfosOpt;
}

export const MsgSwapExactAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
}: MsgSwapExactAmountOutDetailProps) => {
  const outDenoms = msg.routes
    .map((route) => route.tokenInDenom)
    .concat(msg.tokenOut.denom);
  const routes = msg.routes.map((route, index) => ({
    poolId: route.poolId,
    tokenOutDenom: outDenoms.at(index + 1) ?? "",
  }));

  return (
    <Flex alignItems="start" gap={12} flex={1}>
      <Flex direction="column" flex={0.1}>
        <Text variant="body2" textColor="pebble.500" fontWeight={500}>
          Block height
        </Text>
        <ExplorerLink
          value={blockHeight.toString()}
          type="block_height"
          showCopyOnHover
        />
      </Flex>
      <Flex direction="column" flex={0.9}>
        <PoolSwap txHash={txHash} msgIndex={msgIndex} assetInfos={assetInfos} />
        <PoolRoute routes={routes} assetInfos={assetInfos} />
      </Flex>
    </Flex>
  );
};
