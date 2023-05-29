import { Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgSwapExactAmountInDetails } from "lib/utils/tx/types";

import { PoolRoute, PoolSwap } from "./components";

interface MsgSwapExactAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgSwapExactAmountInDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgSwapExactAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgSwapExactAmountInDetailProps) => (
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
    <PoolRoute
      routes={msg.routes}
      assetInfos={assetInfos}
      isOpened={isOpened}
    />
  </Flex>
);
