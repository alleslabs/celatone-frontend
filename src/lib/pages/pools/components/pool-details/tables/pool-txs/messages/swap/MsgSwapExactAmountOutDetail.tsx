import { Box, Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

import { PoolRoute, PoolSwap } from "./components";

interface MsgSwapExactAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgSwapExactAmountOutDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
  ampCopierSection?: string;
}

export const MsgSwapExactAmountOutDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
  ampCopierSection,
}: MsgSwapExactAmountOutDetailProps) => {
  const outDenoms = msg.routes
    .map((route) => route.tokenInDenom)
    .concat(msg.token_out.denom);
  const routes = msg.routes.map((route, index) => ({
    poolId: route.poolId,
    tokenOutDenom: outDenoms.at(index + 1) ?? "",
  }));

  return (
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
        <PoolSwap
          txHash={txHash}
          msgIndex={msgIndex}
          assetInfos={assetInfos}
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
        />
        <PoolRoute
          routes={routes}
          assetInfos={assetInfos}
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
        />
      </Box>
    </Flex>
  );
};
