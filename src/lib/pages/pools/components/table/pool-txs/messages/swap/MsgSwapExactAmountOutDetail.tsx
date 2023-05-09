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
  isOpened: boolean;
}

export const MsgSwapExactAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgSwapExactAmountOutDetailProps) => {
  const outDenoms = msg.routes
    .map((route) => route.tokenInDenom)
    .concat(msg.tokenOut.denom);
  const routes = msg.routes.map((route, index) => ({
    poolId: route.poolId,
    tokenOutDenom: outDenoms.at(index + 1) ?? "",
  }));

  return (
    <Flex alignItems="start" gap={12}>
      <Flex direction="column">
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
        <PoolSwap
          txHash={txHash}
          msgIndex={msgIndex}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
        <PoolRoute
          routes={routes}
          assetInfos={assetInfos}
          isOpened={isOpened}
        />
      </Flex>
    </Flex>
  );
};
