import { Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgSwapExactAmountOutDetails } from "lib/utils/tx/types";

import { PoolRoute, PoolSwap } from "./components";

interface MsgSwapExactAmountOutDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgSwapExactAmountOutDetails;
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
    .concat(msg.token_out.denom);
  const routes = msg.routes.map((route, index) => ({
    poolId: route.poolId,
    tokenOutDenom: outDenoms.at(index + 1) ?? "",
  }));

  return (
    <Flex w="full" direction="column" alignItems="start" gap={6}>
      <Flex gap={12}>
        <PoolInfoText
          title="Block height"
          component={
            <ExplorerLink
              value={blockHeight.toString()}
              type="block_height"
              showCopyOnHover
            />
          }
        />
        <PoolInfoText title="Message" isText text={extractMsgType(msg.type)} />
      </Flex>
      <PoolSwap
        txHash={txHash}
        msgIndex={msgIndex}
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
      <PoolRoute routes={routes} assetInfos={assetInfos} isOpened={isOpened} />
    </Flex>
  );
};
