import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgJoinPoolDetails } from "lib/utils/tx/types";

import { PoolLPCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgJoinPoolDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinPoolDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgJoinPoolDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgJoinPoolDetailProps) => (
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
    <Box w="full">
      <PoolAssetsGrid
        txHash={txHash}
        msgIndex={msgIndex}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolLPCard
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        msgShareAmount={msg.share_out_amount}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
