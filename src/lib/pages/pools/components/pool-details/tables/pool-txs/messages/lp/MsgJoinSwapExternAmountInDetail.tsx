import { Box, Flex } from "@chakra-ui/react";

import { PoolInfoText } from "../components/PoolInfoText";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { AssetInfosOpt } from "lib/services/assetService";
import { extractMsgType } from "lib/utils";
import type { MsgJoinSwapExternAmountInDetails } from "lib/utils/tx/types";

import { LiquidityDivider, PoolLPCard, PoolAssetsGrid } from "./components";

interface MsgJoinSwapExternAmountInDetailProps {
  txHash: string;
  blockHeight: number;
  msgIndex: number;
  msg: MsgJoinSwapExternAmountInDetails;
  assetInfos: AssetInfosOpt;
  isOpened: boolean;
}

export const MsgJoinSwapExternAmountInDetail = ({
  txHash,
  blockHeight,
  msgIndex,
  msg,
  assetInfos,
  isOpened,
}: MsgJoinSwapExternAmountInDetailProps) => (
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
        msgIndex={msgIndex}
        msgAssets={[msg.token_in]}
        isJoin
        assetInfos={assetInfos}
        isOpened={isOpened}
      />
      <LiquidityDivider />
      <PoolLPCard
        txHash={txHash}
        msgIndex={msgIndex}
        poolId={msg.pool_id}
        assetInfos={assetInfos}
        isJoin
        isOpened={isOpened}
      />
    </Box>
  </Flex>
);
