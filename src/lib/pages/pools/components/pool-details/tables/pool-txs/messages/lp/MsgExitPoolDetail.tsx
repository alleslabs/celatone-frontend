import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgExitPoolDetails } from "lib/utils/tx/types";

import { PoolLPCard, LiquidityDivider, PoolAssetsGrid } from "./components";

interface MsgExitPoolDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgExitPoolDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgExitPoolDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgExitPoolDetailProps) => (
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
        isJoin={false}
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
