import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgExitSwapShareAmountInDetails } from "lib/utils/tx/types";

import { PoolLPCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgExitSwapShareAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitSwapShareAmountInDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgExitSwapShareAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgExitSwapShareAmountInDetailProps) => (
  <Flex minW="full" direction="column" alignItems="start" gap={6}>
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
    <Box w="full">
      <PoolLPCard
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        msgShareAmount={msg.share_in_amount}
        assetInfos={assetInfos}
        isJoin={false}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        msgSwapDenom={msg.token_out_denom}
        isJoin={false}
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
