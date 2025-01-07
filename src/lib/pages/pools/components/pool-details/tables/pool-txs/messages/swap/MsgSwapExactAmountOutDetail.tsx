import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfos, Option } from "lib/types";
import { extractMsgType } from "lib/utils";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

import { PoolRoute, PoolSwap } from "./components";

interface MsgSwapExactAmountOutDetailProps {
  ampCopierSection?: string;
  assetInfos: Option<AssetInfos>;
  blockHeight: number;
  isOpened: boolean;
  msg: MsgSwapExactAmountOutDetails;
  msgIndex: number;
  txHash: string;
}

export const MsgSwapExactAmountOutDetail = ({
  ampCopierSection,
  assetInfos,
  blockHeight,
  isOpened,
  msg,
  msgIndex,
  txHash,
}: MsgSwapExactAmountOutDetailProps) => {
  const outDenoms = msg.routes
    .map((route) => route.tokenInDenom)
    .concat(msg.token_out.denom);
  const routes = msg.routes.map((route, index) => ({
    poolId: route.poolId,
    tokenOutDenom: outDenoms[index + 1] ?? "",
  }));

  return (
    <Flex alignItems="start" gap={6} w="full" direction="column">
      <Flex gap={12}>
        <PoolInfoText title="Block height">
          <ExplorerLink
            type="block_height"
            value={blockHeight.toString()}
            ampCopierSection={ampCopierSection}
            showCopyOnHover
          />
        </PoolInfoText>
        <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
      </Flex>
      <Box w="full">
        <PoolSwap
          exactInput={{
            amount: msg.token_out,
            expectedDenom: msg.routes[0].tokenInDenom,
            isExactIn: false,
          }}
          isOpened={isOpened}
          msgIndex={msgIndex}
          txHash={txHash}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
        />
        <PoolRoute
          isOpened={isOpened}
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          routes={routes}
        />
      </Box>
    </Flex>
  );
};
