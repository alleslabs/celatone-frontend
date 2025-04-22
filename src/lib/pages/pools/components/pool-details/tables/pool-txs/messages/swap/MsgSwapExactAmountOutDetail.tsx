import type { AssetInfos, Option } from "lib/types";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

import { Box, Flex } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { extractMsgType } from "lib/utils";

import { PoolInfoText } from "../components/PoolInfoText";
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
    <Flex alignItems="start" direction="column" gap={6} w="full">
      <Flex gap={12}>
        <PoolInfoText title="Block height">
          <ExplorerLink
            ampCopierSection={ampCopierSection}
            showCopyOnHover
            type="block_height"
            value={blockHeight.toString()}
          />
        </PoolInfoText>
        <PoolInfoText title="Message">{extractMsgType(msg.type)}</PoolInfoText>
      </Flex>
      <Box w="full">
        <PoolSwap
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          exactInput={{
            amount: msg.token_out,
            expectedDenom: msg.routes[0].tokenInDenom,
            isExactIn: false,
          }}
          isOpened={isOpened}
          msgIndex={msgIndex}
          txHash={txHash}
        />
        <PoolRoute
          ampCopierSection={ampCopierSection}
          assetInfos={assetInfos}
          isOpened={isOpened}
          routes={routes}
        />
      </Box>
    </Flex>
  );
};
